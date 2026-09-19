import api from "@/services/api";
import { call, put, takeLatest } from "redux-saga/effects";
import { setModalAviso } from "../actions/actionsModais";
import { setServico } from "../actions/actionsServico";
import { types } from "../types/typesServico";

// API retorna { name, price, durationMinutes } — adapta para o formato que a UI espera
const adaptarServico = (s: any) => ({
    ...s,
    nome: s.name,
    preco: `R$ ${Number(s.price).toFixed(2).replace('.', ',')}`,
    duracao: `${s.durationMinutes} min`,
});

const parsePrecoBRL = (preco: any): number => {
    if (typeof preco === 'number') return preco;
    return parseFloat(String(preco).replace(/[R$\s.]/g, '').replace(',', '.')) || 0;
};

const parseDuracaoMin = (duracao: any): number => {
    if (typeof duracao === 'number') return duracao;
    const match = String(duracao).match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 30;
};

function* requestServicos() {
    try {
        const { data: servicos } = yield call(api.get, '/services');
        yield put(setServico(servicos.map(adaptarServico)));
    } catch (error: any) {
        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'erro',
            mensagem: 'Erro ao buscar serviços. Tente novamente mais tarde.',
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

function* createServico(action: ReturnType<typeof import('../actions/actionsServico').createServico>) {
    try {
        const payload = action.payload as any;
        yield call(api.post, '/services', {
            name: payload.nome,
            price: parsePrecoBRL(payload.preco),
            durationMinutes: parseDuracaoMin(payload.duracao),
        });
        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'sucesso',
            mensagem: 'Serviço criado com sucesso!',
            textAlign: 'center',
            onPress: () => { },
            onPressCancel: () => { },
            textoBotao: 'OK',
            desabilitaFecharPorTouch: false,
            textoBotaoCancelar: '',
            textoBotaoConfirmar: '',
            inverterCoresBotaoInfo: false,
        }));
        yield requestServicos();
    } catch (error: any) {
        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'erro',
            mensagem: 'Erro ao criar serviço. ' + (error?.message || ''),
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

function* updateServico(action: ReturnType<typeof import('../actions/actionsServico').updateServico>) {
    try {
        const payload = action.payload as any;
        yield call(api.patch, `/services/${payload.id}`, {
            name: payload.name || payload.nome,
            price: parsePrecoBRL(payload.price ?? payload.preco),
            durationMinutes: parseDuracaoMin(payload.durationMinutes ?? payload.duracao),
        });
        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'sucesso',
            mensagem: 'Serviço atualizado com sucesso!',
            textAlign: 'center',
            onPress: () => { },
            onPressCancel: () => { },
            textoBotao: 'OK',
            desabilitaFecharPorTouch: false,
            textoBotaoCancelar: '',
            textoBotaoConfirmar: '',
            inverterCoresBotaoInfo: false,
        }));
        yield requestServicos();
    } catch (error: any) {
        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'erro',
            mensagem: 'Erro ao atualizar serviço. ' + (error?.message || ''),
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

function* deleteServico(action: ReturnType<typeof import('../actions/actionsServico').deleteServico>) {
    try {
        yield call(api.delete, `/services/${action.payload}`);
        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'sucesso',
            mensagem: 'Serviço removido com sucesso!',
            textAlign: 'center',
            onPress: () => { },
            onPressCancel: () => { },
            textoBotao: 'OK',
            desabilitaFecharPorTouch: false,
            textoBotaoCancelar: '',
            textoBotaoConfirmar: '',
            inverterCoresBotaoInfo: false,
        }));
        yield requestServicos();
    } catch (error: any) {
        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'erro',
            mensagem: 'Erro ao remover serviço. ' + (error?.message || ''),
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

export default function* sagasServicos() {
    yield takeLatest(types.REQUEST_SERVICOS, requestServicos);
    yield takeLatest(types.CREATE_SERVICO, createServico);
    yield takeLatest(types.UPDATE_SERVICO, updateServico);
    yield takeLatest(types.DELETE_SERVICO, deleteServico);
}
