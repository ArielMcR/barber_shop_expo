import type {
    RelatorioAtendimentos,
    RelatorioDetalhamento,
    RelatorioServicos,
} from "@/types/typesRelatorio";
import { types } from "../types/typesRelatorio";

/**
 * Tipo explícito, e não inferido do `initialState`: com `action: any`, cada
 * `action.payload` volta como `any` e o tipo do slice se alargava — as telas
 * perdiam a tipagem de `servicos`/`atendimentos` e caíam em `unknown`.
 */
type EstadoRelatorio = {
    dashboard: any;
    faturamento: any;
    servicos: RelatorioServicos | null;
    atendimentos: RelatorioAtendimentos | null;
    detalhamento: RelatorioDetalhamento | null;
    periodo: 'hoje' | 'semana' | 'mes';
    carregando: boolean;
    erro: string | null;
};

const initialState: EstadoRelatorio = {
    dashboard: null,
    faturamento: null,
    servicos: null,
    atendimentos: null,
    detalhamento: null,
    periodo: 'hoje',
    carregando: false,
    erro: null,
}

export const relatorioReducer = (
    state = initialState,
    action: any,
): EstadoRelatorio => {
    switch (action.type) {
        case types.SET_DASHBOARD:
            return {
                ...state,
                dashboard: action.payload,
            };
        case types.SET_FATURAMENTO:
            return {
                ...state,
                faturamento: action.payload,
            };
        case types.SET_SERVICOS:
            return {
                ...state,
                servicos: action.payload,
            };
        case types.SET_ATENDIMENTOS:
            return {
                ...state,
                atendimentos: action.payload,
            };
        case types.SET_DETALHAMENTO:
            return {
                ...state,
                detalhamento: action.payload,
            };
        case types.SET_PERIODO:
            return {
                ...state,
                periodo: action.payload,
            };
        case types.SET_CARREGANDO:
            return {
                ...state,
                carregando: action.payload,
            };
        case types.SET_ERRO:
            return {
                ...state,
                erro: action.payload,
            };
        default:
            return state;
    }
}
