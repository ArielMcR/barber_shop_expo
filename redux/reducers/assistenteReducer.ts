import { Mensagem } from "@/types/typesAssistente";
import { types } from "../types/typesAssistente";

type EstadoAssistente = {
    mensagens: Mensagem[];
    carregando: boolean;
    erro: string | null;
    /** Ler as respostas em voz alta. Vive aqui, e não na tela, para sobreviver
     *  à troca de abas — as tabs continuam montadas, mas o FAB da agenda também
     *  leva para cá e o ajuste precisa valer nos dois caminhos. */
    vozAtiva: boolean;
};

const initialState: EstadoAssistente = {
    mensagens: [],
    carregando: false,
    erro: null,
    vozAtiva: true,
};

// Contador local para ids: nem toda mensagem tem commandId (a do usuario e
// otimista, criada antes de a API responder), e a FlatList precisa de key.
let sequencia = 0;
const proximoId = () => `m${Date.now()}-${++sequencia}`;

export const assistenteReducer = (
    state = initialState,
    action: any,
): EstadoAssistente => {
    switch (action.type) {
        case types.SEND_COMMAND_REQUEST:
            // A mensagem do usuario entra na hora, sem esperar a rede — e o que
            // faz o chat parecer responsivo enquanto o Gemini pensa.
            return {
                ...state,
                carregando: true,
                erro: null,
                mensagens: [
                    ...state.mensagens,
                    {
                        id: proximoId(),
                        autor: 'usuario',
                        texto: action.payload.texto,
                        criadaEm: new Date().toISOString(),
                    },
                ],
            };

        case types.SEND_AUDIO_REQUEST:
            // Bolha do usuario sem texto: so saberemos o que ele falou quando o
            // backend devolver a transcricao.
            return {
                ...state,
                carregando: true,
                erro: null,
                mensagens: [
                    ...state.mensagens,
                    {
                        id: proximoId(),
                        autor: 'usuario',
                        texto: '',
                        aguardandoTranscricao: true,
                        criadaEm: new Date().toISOString(),
                    },
                ],
            };

        case types.SEND_COMMAND_SUCCESS: {
            // Havia bolha aguardando transcrição => o comando veio falado. É um
            // sinal mais firme que `payload.transcription`, que pode chegar
            // vazia quando o Gemini não reconhece fala nenhuma no áudio.
            const veioDeVoz = state.mensagens.some((m) => m.aguardandoTranscricao);

            // Preenche a bolha de voz pendente com o que o Gemini transcreveu.
            const mensagens = state.mensagens.map((m) =>
                m.aguardandoTranscricao
                    ? {
                        ...m,
                        texto: action.payload.transcription || '(áudio sem fala reconhecida)',
                        aguardandoTranscricao: false,
                    }
                    : m,
            );

            return {
                ...state,
                carregando: false,
                erro: null,
                mensagens: [
                    ...mensagens,
                    {
                        id: proximoId(),
                        autor: 'assistente',
                        texto: action.payload.response,
                        status: action.payload.status,
                        ferramenta: action.payload.toolExecuted,
                        porVoz: veioDeVoz,
                        criadaEm: new Date().toISOString(),
                    },
                ],
            };
        }

        case types.SEND_COMMAND_FAILURE:
            // Falha de rede: o backend nao chegou a responder, entao nao ha
            // status de comando — vira uma bolha de erro local.
            return {
                ...state,
                carregando: false,
                erro: action.payload.mensagem,
                mensagens: [
                    // Uma bolha de voz que nunca recebeu transcricao ficaria
                    // vazia para sempre — marca como falha de captura.
                    ...state.mensagens.map((m) =>
                        m.aguardandoTranscricao
                            ? { ...m, texto: '(áudio não enviado)', aguardandoTranscricao: false }
                            : m,
                    ),
                    {
                        id: proximoId(),
                        autor: 'assistente',
                        texto: action.payload.mensagem,
                        status: 'EXECUTION_ERROR',
                        criadaEm: new Date().toISOString(),
                    },
                ],
            };

        case types.CLEAR_CHAT:
            // Limpar a conversa não é motivo para religar a voz que o usuário
            // desligou — `initialState` puro faria exatamente isso.
            return { ...initialState, vozAtiva: state.vozAtiva };

        case types.TOGGLE_VOICE:
            return { ...state, vozAtiva: !state.vozAtiva };

        default:
            return state;
    }
};
