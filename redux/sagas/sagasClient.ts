import { put, takeLatest } from "redux-saga/effects";
import { setClients } from "../actions/actionsClients";
import { setModalAviso } from "../actions/actionsModais";
import { types } from "../types/typesCliente";

let clientes = [
    { id: 1, nome: 'João Silva', telefone: '(11) 98765-4321', ultimaVisita: '15/11/2025' },
    { id: 2, nome: 'Pedro Santos', telefone: '(11) 98765-4322', ultimaVisita: '18/11/2025' },
    { id: 3, nome: 'Carlos Oliveira', telefone: '(11) 98765-4323', ultimaVisita: '20/11/2025' },
    { id: 4, nome: 'Lucas Ferreira', telefone: '(11) 98765-4324', ultimaVisita: '21/11/2025' },
    { id: 5, nome: 'Lucas Ferreira', telefone: '(11) 98765-4324', ultimaVisita: '21/11/2025' },
    { id: 6, nome: 'Lucas Ferreira', telefone: '(11) 98765-4324', ultimaVisita: '21/11/2025' },
    { id: 7, nome: 'Lucas Ferreira', telefone: '(11) 98765-4324', ultimaVisita: '21/11/2025' },
    { id: 8, nome: 'Lucas Ferreira', telefone: '(11) 98765-4324', ultimaVisita: '21/11/2025' },
    { id: 9, nome: 'Lucas Ferreira', telefone: '(11) 98765-4324', ultimaVisita: '21/11/2025' },
    { id: 10, nome: 'Lucas Ferreira', telefone: '(11) 98765-4324', ultimaVisita: '21/11/2025' },
];



function* requestClients() {
    try {
        // const {data: clientes} = yield call(api.get, '/clientes');
        yield put(setClients(clientes));
    } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'erro',
            mensagem: 'Erro ao buscar clientes. Por favor, tente novamente mais tarde.',
            textAlign: 'center',
            onPress: () => { },
            onPressCancel: () => { },
            textoBotao: 'OK',
            desabilitaFecharPorTouch: false,
            textoBotaoCancelar: '',
            textoBotaoConfirmar: '',
            inverterCoresBotaoInfo: false,
        }))
    }
}

function* createClient(action: ReturnType<typeof import('../actions/actionsClients').createClient>) {
    try {
        // Lógica para criar cliente depois
        console.log("Criando cliente:", action.payload.client);
        clientes.push(action.payload.client);
        // yield call(api.post, '/clientes', action.client);
        // Após criar, você pode querer atualizar a lista de clientes
        yield requestClients();
    } catch (error) {
        console.error("Erro ao criar cliente:", error);
    }
}
function* updateClient(action: ReturnType<typeof import('../actions/actionsClients').updateClient>) {
    try {
        // Lógica para atualizar cliente
        // yield call(api.put, `/clientes/${action.client.id}`, action.client);
        // Após atualizar, você pode querer atualizar a lista de clientes
        yield requestClients();
    } catch (error) {
        console.error("Erro ao atualizar cliente:", error);
    }
}
function* deleteClient(action: ReturnType<typeof import('../actions/actionsClients').deleteClient>) {
    try {
        // Lógica para deletar cliente
        // yield call(api.delete, `/clientes/${action.clientId}`);
        // Após deletar, você pode querer atualizar a lista de clientes
        yield requestClients();
    } catch (error) {
        console.error("Erro ao deletar cliente:", error);
    }
}
export default function* sagasClientes() {
    yield takeLatest(types.REQUEST_CLIENTS, requestClients);
    yield takeLatest(types.CREATE_CLIENT, createClient);
    yield takeLatest(types.UPDATE_CLIENT, updateClient);
    yield takeLatest(types.DELETE_CLIENT, deleteClient);
}