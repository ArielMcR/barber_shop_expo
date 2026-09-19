import CabecalhoTela from '@/components/CabecalhoTela';
import ScreenWrapper, { useInsets } from '@/components/ScreenWrapper';
import { Cores, Sombra } from '@/constants/design';
import { useModalAviso } from '@/hooks/useModalAviso';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import ModalAgendamento from '@/modais/ModalAgendamento';
import ModalDetalheAgendamento from '@/modais/ModalDetalheAgendamento';
import { concluirAgendamento, createAgendamento, deleteAgendamento, requestAgendamentos, updateAgendamento } from '@/redux/actions/actionsAgendamento';
import { requestClients } from '@/redux/actions/actionsClients';
import { setModalAgendamento } from '@/redux/actions/actionsModais';
import { requestServico } from '@/redux/actions/actionsServico';
import { SLOTS_MANHA, SLOTS_TARDE, TODOS_SLOTS } from '@/utils/constants';
import { paraDataLocalISO } from '@/utils/conversorData';
import Feather from '@expo/vector-icons/Feather';
import { useFocusEffect, useRouter } from 'expo-router';
import { Speech } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';

type DiaSemana = {
    dia: string;
    diaSemana: string;
    data: string;
    hoje: boolean;
};

type AgendamentoSlot = {
    id?: number;        // ID do agendamento na API (ausente nos slots de continuação)
    horario: string;
    cliente: any;
    servico: any;
    duracaoMin: number;
    ocupadoPor?: string;
    status?: string;
};

const calcEndTime = (startTime: string, durationMinutes: number): string => {
    const [h, m] = startTime.split(':').map(Number);
    const totalMin = h * 60 + m + durationMinutes;
    return `${String(Math.floor(totalMin / 60)).padStart(2, '0')}:${String(totalMin % 60).padStart(2, '0')}`;
};

/** Rótulo de seção: versalete fino + fio, no lugar dos ícones coloridos. */
const TituloSecao = ({ texto, esmaecido }: { texto: string; esmaecido?: boolean }) => (
    <View className="flex-row items-center gap-3 mx-5 mb-3">
        <Text
            className={`font-display text-[11px] tracking-[2px] ${esmaecido ? 'text-ink-subtle' : 'text-ink-muted'}`}
        >
            {texto}
        </Text>
        <View className="flex-1 h-px bg-line" />
    </View>
);

export default function AgendamentosScreen() {
    const insets = useInsets();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const modalAviso = useModalAviso();

    const agendamentos = useAppSelector((state: any) => state.agendamentos.agendamentos);

    const [semanaOffset, setSemanaOffset] = useState(0);
    const [diaSelecionado, setDiaSelecionado] = useState<string>(() => {
        return paraDataLocalISO(new Date());
    });
    const [modalDetalhe, setModalDetalhe] = useState<{ visible: boolean; slot: AgendamentoSlot | null }>({
        visible: false,
        slot: null,
    });

    // useFocusEffect em vez de useEffect([]): as abas permanecem montadas ao
    // trocar de tela, então o efeito de montagem roda uma única vez na vida do
    // app. Quem agenda pelo assistente e volta para cá via aba continuava vendo
    // a agenda de antes.
    useFocusEffect(
        useCallback(() => {
            dispatch(requestClients());
            dispatch(requestServico());
            dispatch(requestAgendamentos());
        }, [dispatch]),
    );

    const diasSemana = useMemo(() => {
        const hoje = new Date();
        const dias: DiaSemana[] = [];
        const diaSemanaAtual = hoje.getDay();
        const diferencaParaSegunda = diaSemanaAtual === 0 ? -6 : 1 - diaSemanaAtual;
        const segundaFeira = new Date(hoje);
        segundaFeira.setDate(hoje.getDate() + diferencaParaSegunda + semanaOffset * 7);

        const diasDaSemanaLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        for (let i = 0; i < 6; i++) {
            const data = new Date(segundaFeira);
            data.setDate(segundaFeira.getDate() + i);
            // Chave local: com toISOString, das 21h em diante a grade inteira
            // apontava para o dia seguinte e a agenda aparecia vazia.
            const dataStr = paraDataLocalISO(data);
            const hojeStr = paraDataLocalISO(hoje);
            dias.push({
                dia: data.getDate().toString(),
                diaSemana: diasDaSemanaLabels[i],
                data: dataStr,
                hoje: dataStr === hojeStr,
            });
        }
        return dias;
    }, [semanaOffset]);

    const agendamentosDoDia: AgendamentoSlot[] = useMemo(() => {
        return agendamentos[diaSelecionado] || [];
    }, [agendamentos, diaSelecionado]);

    const getSlotInfo = useCallback((horario: string) => {
        return agendamentosDoDia.find(a => a.horario === horario);
    }, [agendamentosDoDia]);

    /** Duração do atendimento = soma dos serviços escolhidos. */
    const somarDuracoes = (servicos: any[]): number =>
        servicos.reduce((total, s) => {
            const match = /(\d+)/.exec(String(s?.duracao ?? ''));
            return total + (match ? parseInt(match[1], 10) : 30);
        }, 0);

    const adicionarAgendamento = (cliente: any, servicos: any[], horario: string) => {
        // Duração do atendimento é a SOMA dos serviços escolhidos.
        const duracaoMin = somarDuracoes(servicos);
        const slotsNecessarios = Math.ceil(duracaoMin / 30);
        const indexInicio = TODOS_SLOTS.indexOf(horario);

        if (indexInicio === -1) return;

        // Verificar conflitos
        const slotsParaOcupar = TODOS_SLOTS.slice(indexInicio, indexInicio + slotsNecessarios);
        const conflito = slotsParaOcupar.find(slot =>
            agendamentosDoDia.some(a => a.horario === slot)
        );
        if (conflito) {
            modalAviso.mostrarErro(`Conflito de horário! O slot ${conflito} já está ocupado.`);
            return;
        }

        if (indexInicio + slotsNecessarios > TODOS_SLOTS.length) {
            modalAviso.mostrarAviso('O serviço ultrapassa o horário de funcionamento.');
            return;
        }

        const indexUltimoManha = SLOTS_MANHA.length - 1;
        if (indexInicio <= indexUltimoManha && indexInicio + slotsNecessarios > SLOTS_MANHA.length) {
            modalAviso.mostrarAviso('O serviço não pode atravessar o horário de almoço (12:00 - 13:00).');
            return;
        }

        dispatch(createAgendamento({
            clientId: cliente.id,
            serviceIds: servicos.map((s) => s.id),
            horario,
            data: diaSelecionado,
            durationMinutes: duracaoMin,
        }));
    };

    const substituirAgendamento = (horario: string, cliente: any, servicos: any[]) => {
        const duracaoMin = somarDuracoes(servicos);
        const slotsNecessarios = Math.ceil(duracaoMin / 30);
        const indexInicio = TODOS_SLOTS.indexOf(horario);

        if (indexInicio === -1) return;

        if (indexInicio + slotsNecessarios > TODOS_SLOTS.length) {
            modalAviso.mostrarAviso('O serviço ultrapassa o horário de funcionamento.');
            return;
        }

        const indexUltimoManha = SLOTS_MANHA.length - 1;
        if (indexInicio <= indexUltimoManha && indexInicio + slotsNecessarios > SLOTS_MANHA.length) {
            modalAviso.mostrarAviso('O serviço não pode atravessar o horário de almoço (12:00 - 13:00).');
            return;
        }

        // Remove slots do agendamento atual para verificar conflitos com os restantes
        const slotAtual = agendamentosDoDia.find(a => a.horario === horario && !a.ocupadoPor);
        if (!slotAtual?.id) return;

        const semAntigo = agendamentosDoDia.filter(
            a => a.horario !== horario && a.ocupadoPor !== horario
        );
        const slotsParaOcupar = TODOS_SLOTS.slice(indexInicio, indexInicio + slotsNecessarios);
        const conflito = slotsParaOcupar.find(slot => semAntigo.some(a => a.horario === slot));

        if (conflito) {
            modalAviso.mostrarErro(`Conflito de horário! O slot ${conflito} já está ocupado.`);
            return;
        }

        dispatch(updateAgendamento({
            id: slotAtual.id,
            clientId: cliente.id,
            serviceIds: servicos.map((s) => s.id),
            startTime: horario,
            endTime: calcEndTime(horario, duracaoMin),
        }));
    };

    const onConfirmar = ({ cliente, servicos, horario, modo }: {
        cliente: any;
        servicos: any[];
        horario: string;
        modo: 'novo' | 'trocar_cliente' | 'trocar_servico';
    }) => {
        if (modo === 'novo') {
            adicionarAgendamento(cliente, servicos, horario);
        } else {
            substituirAgendamento(horario, cliente, servicos);
        }
    };

    const abrirModalAgendamento = (horario: string) => {
        dispatch(setModalAgendamento({
            statusAtivo: true,
            horario,
            data: diaSelecionado,
            modo: 'novo',
        }));
    };

    const abrirDetalhe = (horario: string) => {
        const slot = agendamentosDoDia.find(a => a.horario === horario && !a.ocupadoPor);
        if (slot) setModalDetalhe({ visible: true, slot });
    };

    const trocarCliente = (slot: AgendamentoSlot) => {
        dispatch(setModalAgendamento({
            statusAtivo: true,
            horario: slot.horario,
            data: diaSelecionado,
            modo: 'trocar_cliente',
            // `servico` é o resumo dos itens; `itens` traz a lista original,
            // para o modal remarcar exatamente o que já estava escolhido.
            servicoAtual: slot.servico?.itens ?? slot.servico,
        }));
    };

    const trocarServico = (slot: AgendamentoSlot) => {
        dispatch(setModalAgendamento({
            statusAtivo: true,
            horario: slot.horario,
            data: diaSelecionado,
            modo: 'trocar_servico',
            clienteAtual: slot.cliente,
        }));
    };

    const removerAgendamento = (horario: string) => {
        const slot = agendamentosDoDia.find(a => a.horario === horario && !a.ocupadoPor);
        if (!slot?.id) return;

        modalAviso.mostrarConfirmacao(
            'Deseja cancelar este agendamento?',
            {
                textoBotaoConfirmar: 'Cancelar agendamento',
                textoBotaoCancelar: 'Voltar',
                tipo: 'aviso',
                onConfirmar: () => {
                    dispatch(deleteAgendamento(slot.id!));
                    setModalDetalhe({ visible: false, slot: null });
                },
            }
        );
    };

    const concluirAgendamentoHandler = (slot: AgendamentoSlot) => {
        if (!slot.id) return;

        modalAviso.mostrarConfirmacao(
            'Marcar este atendimento como concluído?',
            {
                textoBotaoConfirmar: 'Concluir',
                textoBotaoCancelar: 'Voltar',
                tipo: 'sucesso',
                onConfirmar: () => {
                    dispatch(concluirAgendamento(slot.id!));
                    setModalDetalhe({ visible: false, slot: null });
                },
            }
        );
    };

    const renderSlot = (horario: string) => {
        const slot = getSlotInfo(horario);

        // Vazio: sem card, sem preenchimento. Só um contorno tracejado que
        // recua para o fundo e deixa os horários ocupados sobressaírem.
        if (!slot) {
            return (
                <TouchableOpacity
                    key={horario}
                    onPress={() => abrirModalAgendamento(horario)}
                    className="flex-row items-center rounded-card mx-4 mb-2 py-3.5 px-4 border border-dashed border-line-strong"
                    activeOpacity={0.6}
                >
                    <View className="w-14">
                        <Text className="font-display-md text-[15px] tracking-[0.5px] text-ink-subtle">{horario}</Text>
                    </View>
                    <View className="flex-1 flex-row items-center gap-2">
                        <Feather name="plus" size={13} color={Cores.inkSubtle} />
                        <Text className="font-sans text-[13px] text-ink-subtle">Disponível</Text>
                    </View>
                </TouchableOpacity>
            );
        }

        // Continuação de um serviço longo: subordinado ao card principal —
        // mesmo trilho, mas esmaecido, para ler como "extensão" e não como
        // um segundo agendamento.
        if (slot.ocupadoPor) {
            const concluido = slot.status === 'COMPLETED';
            return (
                <TouchableOpacity
                    key={horario}
                    onPress={() => abrirDetalhe(slot.ocupadoPor!)}
                    className="flex-row items-center bg-surface-alt rounded-card mx-4 mb-2 py-3 px-4 overflow-hidden"
                    activeOpacity={0.7}
                >
                    <View
                        className={`absolute left-0 top-0 bottom-0 w-1 ${concluido ? 'bg-success-border' : 'bg-brand-border'}`}
                    />
                    <View className="w-14">
                        <Text className="font-display-md text-[15px] tracking-[0.5px] text-ink-subtle">{horario}</Text>
                    </View>
                    <View className="flex-1 flex-row items-center gap-2">
                        <Feather name="arrow-up" size={12} color={Cores.inkSubtle} />
                        <Text className="font-sans text-[13px] text-ink-subtle" numberOfLines={1}>
                            Em atendimento — {slot.cliente?.nome}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        }

        // Agendamento: card branco sobre creme, com filete de cor à esquerda.
        // Cobre = ativo, verde = concluído. É a única distinção de cor da lista.
        const concluido = slot.status === 'COMPLETED';
        return (
            <TouchableOpacity
                key={horario}
                onPress={() => abrirDetalhe(horario)}
                className="bg-surface rounded-card mx-4 mb-2 overflow-hidden"
                style={Sombra.nivel1}
                activeOpacity={0.7}
            >
                <View className={`absolute left-0 top-0 bottom-0 w-1 ${concluido ? 'bg-success' : 'bg-brand'}`} />
                <View className="flex-row items-center py-3.5 pl-4 pr-4">
                    <View className="w-14">
                        <Text
                            className={`font-display text-[17px] tracking-[0.5px] ${concluido ? 'text-success' : 'text-brand-deep'}`}
                        >
                            {horario}
                        </Text>
                    </View>

                    <View className="flex-1 pl-1 pr-2">
                        <View className="flex-row items-center gap-1.5">
                            <Text className="font-bold text-[15px] text-ink flex-shrink" numberOfLines={1}>
                                {slot.cliente?.nome}
                            </Text>
                            {concluido && (
                                <Feather name="check-circle" size={13} color={Cores.success} />
                            )}
                        </View>
                        <View className="flex-row items-center gap-1.5 mt-1">
                            <Text className="font-sans text-[12.5px] text-ink-muted flex-shrink" numberOfLines={1}>
                                {slot.servico?.nome}
                            </Text>
                            <Text className="font-sans text-[12.5px] text-ink-subtle">·</Text>
                            <Text className="font-sans text-[12.5px] text-ink-subtle">{slot.servico?.duracao}</Text>
                        </View>
                    </View>

                    <Text
                        className={`font-display text-[15px] tracking-[0.3px] ${concluido ? 'text-success' : 'text-ink'}`}
                    >
                        {slot.servico?.preco}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ScreenWrapper className="flex-1 bg-canvas" withTopInset={false}>
            <CabecalhoTela
                titulo="AGENDAMENTOS"
                subtitulo={`${diasSemana[0] && new Date(diasSemana[0].data).toLocaleDateString('pt-BR', {
                    day: '2-digit', month: 'short',
                })} — ${diasSemana[5] && new Date(diasSemana[5].data).toLocaleDateString('pt-BR', {
                    day: '2-digit', month: 'short', year: 'numeric',
                })}`}
                acoes={
                    <View className="flex-row items-center gap-1.5">
                        <Pressable
                            onPress={() => setSemanaOffset(prev => prev - 1)}
                            className="w-9 h-9 rounded-full border border-line items-center justify-center active:bg-surface-alt"
                        >
                            <Feather name="chevron-left" size={17} color={Cores.inkMuted} />
                        </Pressable>
                        <Pressable
                            onPress={() => setSemanaOffset(0)}
                            className="px-3 h-9 rounded-full border border-line items-center justify-center active:bg-surface-alt"
                        >
                            <Text className="font-semibold text-[12px] text-ink-muted">Hoje</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setSemanaOffset(prev => prev + 1)}
                            className="w-9 h-9 rounded-full border border-line items-center justify-center active:bg-surface-alt"
                        >
                            <Feather name="chevron-right" size={17} color={Cores.inkMuted} />
                        </Pressable>
                    </View>
                }
            />

            {/* Seletor de dia */}
            <View className="border-b border-line pb-3">
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
                >
                    {diasSemana.map((dia) => {
                        const selecionado = diaSelecionado === dia.data;
                        return (
                            <TouchableOpacity
                                key={dia.data}
                                onPress={() => setDiaSelecionado(dia.data)}
                                activeOpacity={0.8}
                                className={`items-center justify-center px-3.5 py-2.5 rounded-control min-w-[52px] border ${selecionado
                                    ? 'bg-brand border-brand'
                                    : dia.hoje
                                        ? 'bg-brand-soft border-brand-border'
                                        : 'bg-surface border-line'
                                    }`}
                            >
                                <Text
                                    className={`font-medium text-[10.5px] tracking-[0.6px] uppercase ${selecionado
                                        ? 'text-ink-inverse'
                                        : dia.hoje
                                            ? 'text-brand-deep'
                                            : 'text-ink-subtle'
                                        }`}
                                >
                                    {dia.diaSemana}
                                </Text>
                                <Text
                                    className={`font-display text-[20px] leading-[24px] mt-0.5 ${selecionado
                                        ? 'text-ink-inverse'
                                        : dia.hoje
                                            ? 'text-brand-deep'
                                            : 'text-ink'
                                        }`}
                                >
                                    {dia.dia}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingTop: 16 }}>
                <TituloSecao texto="MANHÃ" />

                {SLOTS_MANHA.map(renderSlot)}

                <View className="my-4">
                    <TituloSecao texto="ALMOÇO · 12:00 ÀS 13:00" esmaecido />
                </View>

                <TituloSecao texto="TARDE" />

                {SLOTS_TARDE.map(renderSlot)}

                <View style={{ height: 90 }} />
            </ScrollView>

            <ModalAgendamento onConfirmar={onConfirmar} />
            <ModalDetalheAgendamento
                visible={modalDetalhe.visible}
                slot={modalDetalhe.slot}
                onFechar={() => setModalDetalhe({ visible: false, slot: null })}
                onTrocarCliente={() => {
                    if (modalDetalhe.slot) trocarCliente(modalDetalhe.slot);
                }}
                onTrocarServico={() => {
                    if (modalDetalhe.slot) trocarServico(modalDetalhe.slot);
                }}
                onCancelarAgendamento={() => {
                    if (modalDetalhe.slot) removerAgendamento(modalDetalhe.slot.horario);
                }}
                onConcluirAgendamento={() => {
                    if (modalDetalhe.slot) concluirAgendamentoHandler(modalDetalhe.slot);
                }}
                concluido={modalDetalhe.slot?.status === 'COMPLETED'}
            />

            <Pressable
                className="absolute right-5 bg-brand w-14 h-14 rounded-full items-center justify-center active:bg-brand-strong"
                style={[{ bottom: insets.bottom + 24 }, Sombra.nivel3]}
                onPress={() => router.push('/(drawer)/(tabs)/assistente')}
            >
                <Speech size={22} color={Cores.inkInverse} />
            </Pressable>
        </ScreenWrapper>
    );
}
