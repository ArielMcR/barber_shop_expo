import api from "@/services/api";
import { call, put, takeLatest } from "redux-saga/effects";
import { setClients } from "../actions/actionsClients";
import { setModalAviso } from "../actions/actionsModais";
import { types } from "../types/typesCliente";

// Adiciona campo `nome` (usado na tela de agendamentos) mantendo os campos originais da API
const adaptarCliente = (c: any) => ({
    ...c,
    nome: `${c.name}${c.lastName ? ' ' + c.lastName : ''}`,
});

function* requestClients() {
    try {
        const { data: clientes } = yield call(api.get, '/clients');
        yield put(setClients(clientes.map(adaptarCliente)));
    } catch (error) {
        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'erro',
            mensagem: 'Erro ao buscar clientes. Tente novamente mais tarde.',
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

function* createClient(action: ReturnType<typeof import('../actions/actionsClients').createClient>) {
    try {
        yield call(api.post, '/clients', action.payload);
        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'sucesso',
            mensagem: 'Cliente criado com sucesso!',
            textAlign: 'center',
            onPress: () => { },
            onPressCancel: () => { },
            textoBotao: 'OK',
            desabilitaFecharPorTouch: false,
            textoBotaoCancelar: '',
            textoBotaoConfirmar: '',
            inverterCoresBotaoInfo: false,
        }));
        yield requestClients();
    } catch (error: any) {
        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'erro',
            mensagem: 'Erro ao criar cliente. ' + (error?.message || ''),
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

function* updateClient(action: ReturnType<typeof import('../actions/actionsClients').updateClient>) {
    try {
        const payload = action.payload as any;
        yield call(api.patch, `/clients/${payload.id}`, payload);
        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'sucesso',
            mensagem: 'Cliente atualizado com sucesso!',
            textAlign: 'center',
            onPress: () => { },
            onPressCancel: () => { },
            textoBotao: 'OK',
            desabilitaFecharPorTouch: false,
            textoBotaoCancelar: '',
            textoBotaoConfirmar: '',
            inverterCoresBotaoInfo: false,
        }));
        yield requestClients();
    } catch (error: any) {
        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'erro',
            mensagem: 'Erro ao atualizar cliente. ' + (error?.message || ''),
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

function* deleteClient(action: ReturnType<typeof import('../actions/actionsClients').deleteClient>) {
    try {
        yield call(api.delete, `/clients/${action.payload}`);
        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'sucesso',
            mensagem: 'Cliente removido com sucesso!',
            textAlign: 'center',
            onPress: () => { },
            onPressCancel: () => { },
            textoBotao: 'OK',
            desabilitaFecharPorTouch: false,
            textoBotaoCancelar: '',
            textoBotaoConfirmar: '',
            inverterCoresBotaoInfo: false,
        }));
        yield requestClients();
    } catch (error: any) {
        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'erro',
            mensagem: 'Erro ao remover cliente. ' + (error?.message || ''),
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

export default function* sagasClientes() {
    yield takeLatest(types.REQUEST_CLIENTS, requestClients);
    yield takeLatest(types.CREATE_CLIENT, createClient);
    yield takeLatest(types.UPDATE_CLIENT, updateClient);
    yield takeLatest(types.DELETE_CLIENT, deleteClient);
}
