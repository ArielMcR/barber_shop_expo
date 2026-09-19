import api from "@/services/api";
import { RespostaComando } from "@/types/typesAssistente";
import { call, put, takeLatest } from "redux-saga/effects";
import { requestAgendamentos } from "../actions/actionsAgendamento";
import { comandoFalhou, comandoRespondido, enviarAudio, enviarComando } from "../actions/actionsAssistente";
import { requestClients } from "../actions/actionsClients";
import { types } from "../types/typesAssistente";

const MENSAGEM_REDE = 'Não foi possível processar o comando. Verifique sua conexão.';

/**
 * O assistente escreve direto no banco, então as outras telas ficam com dado
 * velho até alguém recarregar. Aqui a gente recarrega só o que a ferramenta
 * executada realmente mexeu — QUERY_SCHEDULE e GENERATE_REPORT são leitura e
 * não invalidam nada.
 */
function* revalidarApos(resposta: RespostaComando) {
    if (resposta.status !== 'SUCCESS') return;

    switch (resposta.toolExecuted) {
        case 'CREATE_APPOINTMENT':
            yield put(requestAgendamentos());
            break;
        case 'REGISTER_CLIENT':
            yield put(requestClients());
            break;
        default:
            break;
    }
}

function* enviarComandoSaga(action: ReturnType<typeof enviarComando>) {
    try {
        const { data } = yield call(api.post, '/assistant/command', {
            text: action.payload.texto,
        });
        yield put(comandoRespondido(data));
        yield* revalidarApos(data);
    } catch (error: any) {
        // Erro de negocio ja vem como resposta 200 com status EXECUTION_ERROR;
        // cair aqui significa rede/servidor fora. Nao usa ModalAviso de
        // proposito: no chat a falha e melhor lida como bolha na conversa.
        yield put(comandoFalhou(error?.message || MENSAGEM_REDE));
    }
}

function* enviarAudioSaga(action: ReturnType<typeof enviarAudio>) {
    try {
        const { uri } = action.payload;

        // FormData do React Native aceita { uri, name, type } no lugar de um
        // Blob — e assim que o arquivo local da gravacao sobe sem ser lido
        // inteiro na memoria do JS.
        const formData = new FormData();
        formData.append('audio', {
            uri,
            name: 'comando.m4a',
            type: 'audio/m4a',
        } as any);

        const { data } = yield call(
            api.post,
            '/assistant/command/audio',
            formData,
            // Content-Type precisa ser sobrescrito: o api.ts fixa application/json
            // no cliente, e o multipart exige o boundary gerado pelo FormData.
            { headers: { 'Content-Type': 'multipart/form-data' } },
        );

        yield put(comandoRespondido(data));
        yield* revalidarApos(data);
    } catch (error: any) {
        yield put(comandoFalhou(error?.message || MENSAGEM_REDE));
    }
}

export default function* sagasAssistente() {
    yield takeLatest(types.SEND_COMMAND_REQUEST, enviarComandoSaga);
    yield takeLatest(types.SEND_AUDIO_REQUEST, enviarAudioSaga);
}
