import api from "@/services/api";
import { paraDataLocalISO } from "@/utils/conversorData";
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import {
    setAtendimentos,
    setCarregando,
    setDashboard,
    setDetalhamento,
    setErro,
    setFaturamento,
    setServicos,
    type PeriodoRelatorio,
} from "../actions/actionsRelatorio";
import { types } from "../types/typesRelatorio";

/**
 * Períodos de CALENDÁRIO — não janelas que terminam agora.
 *
 * O `to` era sempre o instante atual, então qualquer atendimento concluído com
 * data à frente ficava invisível: no dia 16, "Mês" ia só até o dia 16, e um
 * atendimento concluído do dia 21 não aparecia em relatório nenhum. Como
 * faturamento e contagem só somam COMPLETED, esticar até o fim do período não
 * infla nada — só faz o rótulo dizer a verdade.
 *
 * Manda `YYYY-MM-DD`: o back-end resolve data pura como dia local.
 */
const periodoParaIntervalo = (periodo: PeriodoRelatorio): { from: string; to: string } => {
    const agora = new Date();

    if (periodo === 'semana') {
        const domingo = new Date(agora);
        domingo.setDate(agora.getDate() - agora.getDay());
        const sabado = new Date(domingo);
        sabado.setDate(domingo.getDate() + 6);
        return { from: paraDataLocalISO(domingo), to: paraDataLocalISO(sabado) };
    }

    if (periodo === 'mes') {
        const primeiro = new Date(agora.getFullYear(), agora.getMonth(), 1);
        // Dia 0 do mês seguinte é o último dia deste mês — cobre 28/29/30/31.
        const ultimo = new Date(agora.getFullYear(), agora.getMonth() + 1, 0);
        return { from: paraDataLocalISO(primeiro), to: paraDataLocalISO(ultimo) };
    }

    return { from: paraDataLocalISO(agora), to: paraDataLocalISO(agora) };
};

/**
 * `takeLatest` casa o worker pelo formato da AÇÃO — sem o campo `type` na
 * assinatura ele cai no overload de channel e a tipagem quebra.
 */
type AcaoPeriodo = { type: string; payload?: PeriodoRelatorio };

function* requestDashboard(): Generator<any, void, any> {
    try {
        yield put(setCarregando(true));
        yield put(setErro(null));
        const { data } = yield call(api.get, '/reports/dashboard');
        yield put(setDashboard(data));
    } catch (error: any) {
        yield put(setErro(error?.message || 'Erro ao buscar dashboard de relatórios.'));
    } finally {
        yield put(setCarregando(false));
    }
}

/** `?from=&to=` do período pedido, ou do que está no store se não vier nada. */
function* queryDoPeriodo(
    periodoPedido?: PeriodoRelatorio,
): Generator<any, string, any> {
    const periodo: PeriodoRelatorio =
        periodoPedido ?? (yield select((state: any) => state.relatorios.periodo));
    const { from, to } = periodoParaIntervalo(periodo);
    return `?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
}

/**
 * Os três relatórios do filtro numa tacada só, em paralelo. Sagas separadas
 * mexeriam no mesmo `carregando` e o indicador piscaria a cada resposta.
 */
function* requestPeriodo(
    action: AcaoPeriodo,
): Generator<any, void, any> {
    try {
        yield put(setCarregando(true));
        yield put(setErro(null));

        const query: string = yield* queryDoPeriodo(action.payload);
        const [faturamento, servicos, atendimentos] = yield all([
            call(api.get, `/reports/revenue${query}`),
            call(api.get, `/reports/services${query}`),
            call(api.get, `/reports/attendance${query}`),
        ]);

        yield put(setFaturamento(faturamento.data));
        yield put(setServicos(servicos.data));
        yield put(setAtendimentos(atendimentos.data));
    } catch (error: any) {
        yield put(setErro(error?.message || 'Erro ao buscar os dados do período.'));
    } finally {
        yield put(setCarregando(false));
    }
}

function* requestDetalhamento(
    action: AcaoPeriodo,
): Generator<any, void, any> {
    try {
        yield put(setCarregando(true));
        yield put(setErro(null));
        const query: string = yield* queryDoPeriodo(action.payload);
        const { data } = yield call(api.get, `/reports/appointments${query}`);
        yield put(setDetalhamento(data));
    } catch (error: any) {
        yield put(setErro(error?.message || 'Erro ao buscar o detalhamento.'));
    } finally {
        yield put(setCarregando(false));
    }
}

export default function* sagasRelatorios() {
    yield takeLatest(types.REQUEST_DASHBOARD, requestDashboard);
    yield takeLatest(types.REQUEST_PERIODO, requestPeriodo);
    yield takeLatest(types.REQUEST_DETALHAMENTO, requestDetalhamento);
}
