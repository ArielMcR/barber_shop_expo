import { RespostaComando } from "@/types/typesAssistente";
import { types } from "../types/typesAssistente";

export const enviarComando = (texto: string) => ({
    type: types.SEND_COMMAND_REQUEST,
    payload: { texto },
});

/** `uri` é o arquivo local devolvido pelo expo-audio ao parar a gravação. */
export const enviarAudio = (uri: string) => ({
    type: types.SEND_AUDIO_REQUEST,
    payload: { uri },
});

export const comandoRespondido = (payload: RespostaComando) => ({
    type: types.SEND_COMMAND_SUCCESS,
    payload,
});

export const comandoFalhou = (mensagem: string) => ({
    type: types.SEND_COMMAND_FAILURE,
    payload: { mensagem },
});

export const limparConversa = () => ({
    type: types.CLEAR_CHAT,
});

/** Liga/desliga a leitura em voz alta das respostas. */
export const alternarVoz = () => ({
    type: types.TOGGLE_VOICE,
});
