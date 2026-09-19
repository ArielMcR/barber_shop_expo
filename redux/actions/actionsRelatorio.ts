import type {
    RelatorioAtendimentos,
    RelatorioDetalhamento,
    RelatorioServicos,
} from "@/types/typesRelatorio";
import { types } from "../types/typesRelatorio";

export type PeriodoRelatorio = 'hoje' | 'semana' | 'mes';

export const requestDashboard = () => ({
    type: types.REQUEST_DASHBOARD,
});
export const setDashboard = (dashboard: any) => ({
    type: types.SET_DASHBOARD,
    payload: dashboard,
});

/** Busca faturamento, serviços e atendimentos do período de uma vez só. */
export const requestPeriodo = (periodo: PeriodoRelatorio) => ({
    type: types.REQUEST_PERIODO,
    payload: periodo,
});
export const setFaturamento = (faturamento: any) => ({
    type: types.SET_FATURAMENTO,
    payload: faturamento,
});
export const setServicos = (servicos: RelatorioServicos) => ({
    type: types.SET_SERVICOS,
    payload: servicos,
});
export const setAtendimentos = (atendimentos: RelatorioAtendimentos) => ({
    type: types.SET_ATENDIMENTOS,
    payload: atendimentos,
});

/** Lista agendamento a agendamento — só a tela de detalhamento usa. */
export const requestDetalhamento = (periodo: PeriodoRelatorio) => ({
    type: types.REQUEST_DETALHAMENTO,
    payload: periodo,
});
export const setDetalhamento = (detalhamento: RelatorioDetalhamento) => ({
    type: types.SET_DETALHAMENTO,
    payload: detalhamento,
});

export const setPeriodo = (periodo: PeriodoRelatorio) => ({
    type: types.SET_PERIODO,
    payload: periodo,
});
export const setCarregando = (carregando: boolean) => ({
    type: types.SET_CARREGANDO,
    payload: carregando,
});
export const setErro = (erro: string | null) => ({
    type: types.SET_ERRO,
    payload: erro,
});
