import api from "@/services/api";
import { call, put, takeLatest } from "redux-saga/effects";
import { setObservations } from "../actions/actionsObservacoes";
import { setModalAviso } from "../actions/actionsModais";
import { types } from "../types/typesObservacao";

function* requestObservations(action: ReturnType<typeof import('../actions/actionsObservacoes').requestObservations>) {
    try {
        const { data: observations } = yield call(api.get, `/observations/client/${action.payload}`);
        yield put(setObservations(observations));
    } catch (error) {
        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'erro',
            mensagem: 'Erro ao buscar observações. Tente novamente mais tarde.',
            textAlign: 'center',
            onPress: () => { },
            onPressCancel: () => { },
            textoBotao: 'OK',
            desabilitaFecharPorTouch: false,
            textoBotaoCancelar: '',
            textoBotaoConfirmar: '',
            inverterCoresBotaoInfo: false,
        }));
    }
}

function* createObservation(action: ReturnType<typeof import('../actions/actionsObservacoes').createObservation>) {
    try {
        const payload = action.payload as any;
        yield call(api.post, '/observations', payload);
        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'sucesso',
            mensagem: 'Observação adicionada com sucesso!',
            textAlign: 'center',
            onPress: () => { },
            onPressCancel: () => { },
            textoBotao: 'OK',
            desabilitaFecharPorTouch: false,
            textoBotaoCancelar: '',
            textoBotaoConfirmar: '',
            inverterCoresBotaoInfo: false,
        }));
        yield requestObservations({ type: types.REQUEST_OBSERVATIONS, payload: payload.clientId });
    } catch (error: any) {
        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'erro',
            mensagem: 'Erro ao adicionar observação. ' + (error?.message || ''),
            textAlign: 'center',
            onPress: () => { },
            onPressCancel: () => { },
            textoBotao: 'OK',
            desabilitaFecharPorTouch: false,
            textoBotaoCancelar: '',
            textoBotaoConfirmar: '',
            inverterCoresBotaoInfo: false,
        }));
    }
}

function* updateObservation(action: ReturnType<typeof import('../actions/actionsObservacoes').updateObservation>) {
    try {
        const payload = action.payload as any;
        yield call(api.patch, `/observations/${payload.id}`, payload);
        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'sucesso',
            mensagem: 'Observação atualizada com sucesso!',
            textAlign: 'center',
            onPress: () => { },
            onPressCancel: () => { },
            textoBotao: 'OK',
            desabilitaFecharPorTouch: false,
            textoBotaoCancelar: '',
            textoBotaoConfirmar: '',
            inverterCoresBotaoInfo: false,
        }));
        yield requestObservations({ type: types.REQUEST_OBSERVATIONS, payload: payload.clientId });
    } catch (error: any) {
        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'erro',
            mensagem: 'Erro ao atualizar observação. ' + (error?.message || ''),
            textAlign: 'center',
            onPress: () => { },
            onPressCancel: () => { },
            textoBotao: 'OK',
            desabilitaFecharPorTouch: false,
            textoBotaoCancelar: '',
            textoBotaoConfirmar: '',
            inverterCoresBotaoInfo: false,
        }));
    }
}

function* deleteObservation(action: ReturnType<typeof import('../actions/actionsObservacoes').deleteObservation>) {
    try {
        const payload = action.payload as any;
        yield call(api.delete, `/observations/${payload.id}`);
        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'sucesso',
            mensagem: 'Observação removida com sucesso!',
            textAlign: 'center',
            onPress: () => { },
            onPressCancel: () => { },
            textoBotao: 'OK',
            desabilitaFecharPorTouch: false,
            textoBotaoCancelar: '',
            textoBotaoConfirmar: '',
            inverterCoresBotaoInfo: false,
        }));
        yield requestObservations({ type: types.REQUEST_OBSERVATIONS, payload: payload.clientId });
    } catch (error: any) {
        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'erro',
            mensagem: 'Erro ao remover observação. ' + (error?.message || ''),
            textAlign: 'center',
            onPress: () => { },
            onPressCancel: () => { },
            textoBotao: 'OK',
            desabilitaFecharPorTouch: false,
            textoBotaoCancelar: '',
            textoBotaoConfirmar: '',
            inverterCoresBotaoInfo: false,
        }));
    }
}

export default function* sagasObservacoes() {
    yield takeLatest(types.REQUEST_OBSERVATIONS, requestObservations);
    yield takeLatest(types.CREATE_OBSERVATION, createObservation);
    yield takeLatest(types.UPDATE_OBSERVATION, updateObservation);
    yield takeLatest(types.DELETE_OBSERVATION, deleteObservation);
}
