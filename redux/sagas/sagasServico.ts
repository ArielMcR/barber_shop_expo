import { put, takeLatest } from "redux-saga/effects";
import { setModalAviso } from "../actions/actionsModais";
import { setServico } from "../actions/actionsServico";
import { types } from "../types/typesServico";

function* requestServicos() {
    try {
        // const {data: servicos} = yield call(api.get, '/servicos');
        const servicos = [
            { id: 1, nome: 'Corte Simples', duracao: '30 min', preco: 'R$ 30,00' },
            { id: 2, nome: 'Corte + Barba', duracao: '45 min', preco: 'R$ 50,00' },
            { id: 3, nome: 'Barba', duracao: '20 min', preco: 'R$ 25,00' },
            { id: 4, nome: 'Corte Infantil', duracao: '25 min', preco: 'R$ 25,00' },
            { id: 5, nome: 'Platinado', duracao: '90 min', preco: 'R$ 100,00' },
        ]; // Simulação de dados
        yield put(setServico(servicos));
    } catch (error) {
        console.error("Erro ao buscar serviços:", error);
        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'erro',
            mensagem: 'Erro ao buscar serviços. Por favor, tente novamente mais tarde.',
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

function* createServico(action: ReturnType<typeof import('../actions/actionsServico').createServico>) {
    try {
        // Lógica para criar serviço
        // yield call(api.post, '/servicos', action.servico);
        // Após criar, você pode querer atualizar a lista de serviços
        yield requestServicos();
    } catch (error) {
        console.error("Erro ao criar serviço:", error);
    }
}
function* updateServico(action: ReturnType<typeof import('../actions/actionsServico').updateServico>) {
    try {
        // Lógica para atualizar serviço
        // yield call(api.put, `/servicos/${action.servico.id}`, action.servico);
        // Após atualizar, você pode querer atualizar a lista de serviços
        yield requestServicos();
    } catch (error) {
        console.error("Erro ao atualizar serviço:", error);
    }
}
function* deleteServico(action: ReturnType<typeof import('../actions/actionsServico').deleteServico>) {
    try {
        // Lógica para deletar serviço
        // yield call(api.delete, `/servicos/${action.servicoId}`);
        // Após deletar, você pode querer atualizar a lista de serviços
        yield requestServicos();
    } catch (error) {
        console.error("Erro ao deletar serviço:", error);
    }
}
export default function* sagasServicos() {
    yield takeLatest(types.REQUEST_SERVICOS, requestServicos);
    yield takeLatest(types.CREATE_SERVICO, createServico);
    yield takeLatest(types.UPDATE_SERVICO, updateServico);
    yield takeLatest(types.DELETE_SERVICO, deleteServico);
}