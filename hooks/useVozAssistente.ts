import { prepararTextoParaFala } from '@/utils/vozAssistente';
import { setAudioModeAsync } from 'expo-audio';
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Fala as respostas do assistente com o TTS do próprio aparelho.
 *
 * Escolha deliberada por `expo-speech` em vez de um modelo de voz na nuvem: a
 * voz do Gemini é melhor, mas custaria mais uma chamada por resposta, e o que
 * trava o assistente hoje é a **cota diária** do plano gratuito — um comando
 * falado já gasta 3. O TTS local é offline, instantâneo, não gasta cota e vem
 * dentro do Expo Go, sem exigir development build.
 */
export function useVozAssistente() {
    const [falandoId, setFalandoId] = useState<string | null>(null);

    /**
     * Espelho síncrono do `falandoId`. `Speech.stop()` dispara o `onStopped` da
     * fala anterior **depois** de já termos registrado a nova, e esse callback
     * atrasado apagaria o id recém-posto — a bolha voltaria ao ícone de "ouvir"
     * enquanto o aparelho ainda estivesse falando. Só limpa quem ainda é dono.
     */
    const idAtualRef = useRef<string | null>(null);

    const limparSe = useCallback((id: string) => {
        if (idAtualRef.current !== id) return;
        idAtualRef.current = null;
        setFalandoId(null);
    }, []);

    const parar = useCallback(() => {
        idAtualRef.current = null;
        setFalandoId(null);
        Speech.stop();
    }, []);

    const falar = useCallback(
        (id: string, texto: string) => {
            const fala = prepararTextoParaFala(texto);
            if (!fala) return;

            Speech.stop();
            idAtualRef.current = id;
            setFalandoId(id);

            void (async () => {
                // O expo-speech NÃO configura sessão de áudio no iOS: ele chama
                // AVSpeechSynthesizer com `usesApplicationAudioSession = true`,
                // herdando a do app. App que nunca configurou a sessão fica em
                // `soloAmbient` — a categoria que o interruptor lateral de
                // silencioso emudece. O aparelho "fala" e não sai som algum.
                //
                // `playsInSilentMode` põe a sessão em playback, que ignora o
                // interruptor. Precisa ser aqui, e não só ao gravar: ouvir uma
                // resposta digitada nunca passa pelo caminho do microfone.
                try {
                    await setAudioModeAsync({
                        playsInSilentMode: true,
                        allowsRecording: false,
                    });
                } catch {
                    // Sessão recusada não é motivo para desistir de falar.
                }

                // Entre o await e aqui o usuário pode ter tocado em PARAR ou
                // mandado falar outra bolha.
                if (idAtualRef.current !== id) return;

                Speech.speak(fala, {
                    language: 'pt-BR',
                    // Um respiro abaixo do padrão: a voz de sistema em pt-BR sai
                    // apressada, e o que mais importa acertar aqui é justamente
                    // nome de cliente e horário.
                    rate: 0.96,
                    onDone: () => limparSe(id),
                    onStopped: () => limparSe(id),
                    // Só dispara no Android — o módulo iOS nunca emite o evento
                    // de erro. Lá, falha nativa não avisa ninguém.
                    onError: () => limparSe(id),
                });
            })();
        },
        [limparSe],
    );

    /** Tocar na mesma bolha que já está falando interrompe. */
    const alternar = useCallback(
        (id: string, texto: string) => {
            if (idAtualRef.current === id) parar();
            else falar(id, texto);
        },
        [falar, parar],
    );

    // Sair da tela com o assistente no meio de uma frase deixaria a voz tocando
    // sozinha por cima da próxima tela.
    useEffect(
        () => () => {
            // Corpo em bloco, não expressão: `Speech.stop()` devolve Promise, e
            // um cleanup que retorna Promise não é um destrutor válido.
            Speech.stop();
        },
        [],
    );

    return { falandoId, falar, parar, alternar };
}
