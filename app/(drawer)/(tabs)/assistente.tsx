import CabecalhoTela from '@/components/CabecalhoTela';
import ScreenWrapper, { useInsets } from '@/components/ScreenWrapper';
import { Cores, Sombra } from '@/constants/design';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { useModalAviso } from '@/hooks/useModalAviso';
import { useVozAssistente } from '@/hooks/useVozAssistente';
import { alternarVoz, enviarAudio, enviarComando, limparConversa } from '@/redux/actions/actionsAssistente';
import { Mensagem, StatusComando } from '@/types/typesAssistente';
import Feather from '@expo/vector-icons/Feather';
import {
    AudioModule,
    RecordingPresets,
    setAudioModeAsync,
    useAudioRecorder,
    useAudioRecorderState,
    type RecordingOptions,
} from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native';

const SUGESTOES = [
    'Quais são os agendamentos de hoje?',
    'Quanto faturei esse mês?',
    'Agenda o Carlos sexta às 9h para corte',
    'Cadastra cliente Maria, telefone 44988887777',
];

/**
 * Voz, não música. O preset HIGH_QUALITY grava 44,1 kHz estéreo a 128 kbps —
 * para transcrição isso só engorda o upload e a contagem de tokens de áudio,
 * sem melhorar o reconhecimento. Mono em 16 kHz é o padrão de fala e deixa o
 * arquivo cerca de 10x menor.
 */
const GRAVACAO_VOZ: RecordingOptions = {
    ...RecordingPresets.HIGH_QUALITY,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 32000,
    // Os blocos por plataforma só aceitam sampleRate; numberOfChannels e
    // bitRate existem apenas no nível superior.
    android: { ...RecordingPresets.HIGH_QUALITY.android, sampleRate: 16000 },
    ios: { ...RecordingPresets.HIGH_QUALITY.ios, sampleRate: 16000 },
};

/**
 * Abaixo disso não cabe fala — é toque acidental no microfone, não comando.
 * Gravação curta vira um .m4a só de cabeçalho: o backend aceita (tem bytes),
 * o Gemini transcreve silêncio e o usuário perde 3 chamadas da cota diária.
 */
const DURACAO_MINIMA_MS = 400;

/** Só falha ganha cor. Sucesso é o caso normal e não precisa de selo. */
const ehFalha = (status?: StatusComando) =>
    status === 'EXECUTION_ERROR' ||
    status === 'INTERPRETATION_ERROR' ||
    status === 'UNSUPPORTED_INTENT';

const Balao = ({
    mensagem,
    falando,
    onFalar,
}: {
    mensagem: Mensagem;
    falando: boolean;
    onFalar: () => void;
}) => {
    const doUsuario = mensagem.autor === 'usuario';
    const falhou = ehFalha(mensagem.status);

    if (doUsuario) {
        return (
            <View className="items-end mb-2.5">
                <View className="bg-brand rounded-card rounded-br-[4px] px-3.5 py-2.5 max-w-[82%]">
                    {mensagem.aguardandoTranscricao ? (
                        // Ainda não sabemos o que foi falado — o texto chega
                        // junto com a resposta do backend.
                        <View className="flex-row items-center gap-2">
                            <Feather name="mic" size={13} color={Cores.inkInverse} />
                            <Text className="font-sans text-[14px] text-ink-inverse opacity-80">
                                transcrevendo...
                            </Text>
                        </View>
                    ) : (
                        <Text className="font-sans text-[14px] leading-[20px] text-ink-inverse">
                            {mensagem.texto}
                        </Text>
                    )}
                </View>
            </View>
        );
    }

    return (
        <View className="items-start mb-2.5">
            <View
                className={`rounded-card rounded-bl-[4px] px-3.5 py-2.5 max-w-[88%] border ${falhou
                    ? 'bg-danger-soft border-danger-border'
                    : 'bg-surface border-line'
                    }`}
                style={falhou ? undefined : Sombra.nivel1}
            >
                <Text
                    className={`font-sans text-[14px] leading-[20px] ${falhou ? 'text-danger' : 'text-ink'
                        }`}
                >
                    {mensagem.texto}
                </Text>

                {/* Rodapé: ferramenta usada à esquerda, ouvir à direita. O botão
                    aparece em toda resposta — inclusive nas de falha, que é
                    justamente quando o barbeiro está de mãos ocupadas e não vai
                    parar para ler. */}
                <View
                    className={`flex-row items-center gap-1.5 mt-2 pt-2 border-t ${falhou ? 'border-danger-border' : 'border-line'
                        }`}
                >
                    {mensagem.ferramenta ? (
                        <>
                            <Feather name="zap" size={10} color={Cores.inkSubtle} />
                            <Text className="font-display text-[9.5px] tracking-[1.2px] text-ink-subtle">
                                {mensagem.ferramenta}
                            </Text>
                        </>
                    ) : null}

                    <Pressable
                        onPress={onFalar}
                        hitSlop={12}
                        className="ml-auto flex-row items-center gap-1"
                    >
                        <Feather
                            name={falando ? 'square' : 'volume-2'}
                            size={11}
                            color={falando ? Cores.brand : Cores.inkSubtle}
                        />
                        <Text
                            className={`font-display text-[9.5px] tracking-[1.2px] ${falando ? 'text-brand' : 'text-ink-subtle'
                                }`}
                        >
                            {falando ? 'PARAR' : 'OUVIR'}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

export default function AssistenteScreen() {
    const insets = useInsets();
    const dispatch = useAppDispatch();
    const modalAviso = useModalAviso();
    const listaRef = useRef<FlatList<Mensagem>>(null);

    const mensagens = useAppSelector((state) => state.assistente.mensagens);
    const carregando = useAppSelector((state) => state.assistente.carregando);
    const vozAtiva = useAppSelector((state) => state.assistente.vozAtiva);

    const [texto, setTexto] = useState('');

    const { falandoId, falar, parar, alternar } = useVozAssistente();

    /**
     * Quem já foi lido. Sem isso, qualquer re-render que reavaliasse o efeito
     * mandaria a última resposta ser falada de novo — inclusive ao voltar para
     * a aba, que continua montada.
     */
    const jaFaladasRef = useRef(new Set<string>());

    // Voz entra, voz sai: só lê sozinho a resposta de um comando FALADO. Quem
    // digitou está olhando para a tela e não quer o aparelho falando junto.
    useEffect(() => {
        const ultima = mensagens[mensagens.length - 1];
        if (!ultima || ultima.autor !== 'assistente' || !ultima.porVoz) return;
        if (!vozAtiva || jaFaladasRef.current.has(ultima.id)) return;

        jaFaladasRef.current.add(ultima.id);
        falar(ultima.id, ultima.texto);
    }, [mensagens, vozAtiva, falar]);

    // Desligar o som no meio de uma frase precisa calar na hora.
    useEffect(() => {
        if (!vozAtiva) parar();
    }, [vozAtiva, parar]);

    const gravador = useAudioRecorder(GRAVACAO_VOZ);
    const estadoGravador = useAudioRecorderState(gravador);
    const gravando = estadoGravador.isRecording;

    const enviar = useCallback(
        (valor?: string) => {
            const comando = (valor ?? texto).trim();
            if (!comando || carregando) return;
            dispatch(enviarComando(comando));
            setTexto('');
        },
        [texto, carregando, dispatch],
    );

    // Instante em que `record()` de fato começou. `null` = não há gravação —
    // e nesse caso soltar o botão não pode enviar nada.
    const inicioGravacaoRef = useRef<number | null>(null);
    // O dedo pode subir enquanto a permissão/preparo ainda estão em voo; aí a
    // gravação nem deve começar.
    const desistiuRef = useRef(false);

    const iniciarGravacao = useCallback(async () => {
        desistiuRef.current = false;
        try {
            const permissao = await AudioModule.requestRecordingPermissionsAsync();
            if (!permissao.granted) {
                modalAviso.mostrarAviso(
                    'Preciso da permissão de microfone para ouvir seus comandos.',
                );
                return;
            }

            // Sem allowsRecording o iOS não captura; playsInSilentMode evita que
            // o modo silencioso mudo a sessão de áudio.
            await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
            await gravador.prepareToRecordAsync();

            if (desistiuRef.current) return;

            gravador.record();
            inicioGravacaoRef.current = Date.now();
        } catch {
            modalAviso.mostrarErro('Não consegui acessar o microfone.');
        }
    }, [gravador, modalAviso]);

    const pararGravacao = useCallback(async () => {
        const inicio = inicioGravacaoRef.current;
        inicioGravacaoRef.current = null;
        desistiuRef.current = true;

        // Soltar sem nunca ter gravado (toque acidental, ou preparo que não
        // chegou a virar `record()`) não envia comando nenhum — era daqui que
        // saía o "áudio vazio" junto com uma mensagem de texto.
        try {
            if (inicio == null) return;

            await gravador.stop();
            const duracao = Date.now() - inicio;
            const uri = gravador.uri;

            if (!uri) return;
            if (duracao < DURACAO_MINIMA_MS) {
                modalAviso.mostrarAviso('Segure o microfone enquanto fala.');
                return;
            }

            dispatch(enviarAudio(uri));
        } catch {
            modalAviso.mostrarErro('Falha ao finalizar a gravação.');
        } finally {
            // Devolve a sessão de áudio ao modo de reprodução — em `finally`
            // porque `iniciarGravacao` liga `allowsRecording` antes mesmo de
            // `record()`, então até o toque que desiste precisa desfazer.
            //
            // No iOS a sessão em modo de captura roteia a saída para o
            // alto-falante do ouvido: a resposta falada sairia quase inaudível,
            // e o barbeiro acharia que a voz simplesmente não funciona.
            await setAudioModeAsync({
                allowsRecording: false,
                playsInSilentMode: true,
            }).catch(() => { });
        }
    }, [gravador, dispatch, modalAviso]);

    const vazio = mensagens.length === 0;

    return (
        <ScreenWrapper className="flex-1 bg-canvas" withTopInset={false}>
            <CabecalhoTela
                titulo="ASSISTENTE"
                subtitulo="Peça em português, sem navegar pelo app"
                acoes={
                    <View className="flex-row gap-2">
                        <Pressable
                            onPress={() => dispatch(alternarVoz())}
                            className={`w-9 h-9 rounded-full border items-center justify-center ${vozAtiva
                                ? 'border-brand-border bg-brand-soft'
                                : 'border-line active:bg-surface-alt'
                                }`}
                        >
                            <Feather
                                name={vozAtiva ? 'volume-2' : 'volume-x'}
                                size={15}
                                color={vozAtiva ? Cores.brandDeep : Cores.inkMuted}
                            />
                        </Pressable>

                        {mensagens.length > 0 ? (
                            <Pressable
                                onPress={() => dispatch(limparConversa())}
                                className="w-9 h-9 rounded-full border border-line items-center justify-center active:bg-surface-alt"
                            >
                                <Feather name="trash-2" size={15} color={Cores.inkMuted} />
                            </Pressable>
                        ) : null}
                    </View>
                }
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={insets.bottom + 62}
                className="flex-1"
            >
                {vazio ? (
                    <View className="flex-1 px-5 justify-center">
                        <View className="items-center mb-7">
                            <View className="w-14 h-14 rounded-full bg-brand-soft border border-brand-border items-center justify-center">
                                <Feather name="message-circle" size={22} color={Cores.brandDeep} />
                            </View>
                            <Text className="font-sans text-[13.5px] text-ink-muted text-center mt-3 leading-[19px]">
                                Escreva — ou segure o microfone e fale.{'\n'}
                                Consulto a agenda, agendo, cadastro clientes e gero relatórios.
                            </Text>
                        </View>

                        <Text className="font-display text-[10.5px] tracking-[2px] text-ink-subtle mb-2.5">
                            EXPERIMENTE
                        </Text>
                        <View className="gap-2">
                            {SUGESTOES.map((sugestao) => (
                                <Pressable
                                    key={sugestao}
                                    onPress={() => enviar(sugestao)}
                                    className="bg-surface border border-line rounded-card px-3.5 py-3 flex-row items-center justify-between active:bg-surface-alt"
                                >
                                    <Text className="font-sans text-[13.5px] text-ink flex-1 pr-2">
                                        {sugestao}
                                    </Text>
                                    <Feather name="arrow-up-right" size={15} color={Cores.inkSubtle} />
                                </Pressable>
                            ))}
                        </View>
                    </View>
                ) : (
                    <FlatList
                        ref={listaRef}
                        data={mensagens}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <Balao
                                mensagem={item}
                                falando={falandoId === item.id}
                                onFalar={() => alternar(item.id, item.texto)}
                            />
                        )}
                        extraData={falandoId}
                        contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
                        showsVerticalScrollIndicator={false}
                        onContentSizeChange={() =>
                            listaRef.current?.scrollToEnd({ animated: true })
                        }
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag"
                    />
                )}

                {carregando && (
                    <View className="flex-row items-center gap-2 px-5 pb-2">
                        <ActivityIndicator size="small" color={Cores.brand} />
                        <Text className="font-sans text-[12.5px] text-ink-muted">
                            Interpretando o comando...
                        </Text>
                    </View>
                )}

                {gravando && (
                    <View className="flex-row items-center gap-2 px-5 pb-2">
                        <View className="w-2 h-2 rounded-full bg-danger" />
                        <Text className="font-sans text-[12.5px] text-danger">
                            Gravando — solte para enviar
                        </Text>
                    </View>
                )}

                <View
                    className="flex-row items-end gap-2 px-4 pt-3 border-t border-line bg-canvas"
                    style={{ paddingBottom: 12 }}
                >
                    <View className="flex-1 bg-surface border border-line rounded-sheet px-4 py-1">
                        <TextInput
                            className="font-sans text-[14px] text-ink py-2"
                            placeholder={gravando ? 'Ouvindo...' : 'Digite ou segure o microfone'}
                            placeholderTextColor={Cores.inkSubtle}
                            value={texto}
                            onChangeText={setTexto}
                            multiline
                            maxLength={1000}
                            onSubmitEditing={() => enviar()}
                            editable={!carregando && !gravando}
                            style={{ maxHeight: 110 }}
                        />
                    </View>

                    {/* Segurar para falar: o microfone só aparece com o campo
                        vazio, senão ele competiria com o botão de enviar.

                        `key` distinta de propósito: sem ela os dois Pressable
                        ocupam a mesma posição e o React reaproveita a MESMA
                        instância, trocando só as props — a máquina de toque do
                        botão de enviar continuaria viva ao virar microfone. */}
                    {texto.trim().length === 0 ? (
                        <Pressable
                            key="acao-microfone"
                            onPressIn={iniciarGravacao}
                            onPressOut={pararGravacao}
                            disabled={carregando}
                            className={`w-11 h-11 rounded-full items-center justify-center ${carregando
                                ? 'bg-line-strong'
                                : gravando
                                    ? 'bg-danger'
                                    : 'bg-brand active:bg-brand-strong'
                                }`}
                        >
                            <Feather name="mic" size={19} color={Cores.inkInverse} />
                        </Pressable>
                    ) : (
                        <Pressable
                            key="acao-enviar"
                            onPress={() => enviar()}
                            disabled={carregando}
                            className={`w-11 h-11 rounded-full items-center justify-center ${carregando ? 'bg-line-strong' : 'bg-brand active:bg-brand-strong'
                                }`}
                        >
                            <Feather name="arrow-up" size={19} color={Cores.inkInverse} />
                        </Pressable>
                    )}
                </View>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
}
