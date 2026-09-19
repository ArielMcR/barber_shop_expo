import { types } from "../types/typesAgendamento";

interface AgendamentoState {
    agendamentos: Record<string, any[]>;
    loading: boolean;
}

const initialState: AgendamentoState = {
    agendamentos: {},
    loading: false,
};

export function agendamentoReducer(state = initialState, action: any): AgendamentoState {
    switch (action.type) {
        case types.REQUEST_AGENDAMENTOS:
        case types.CREATE_AGENDAMENTO:
        case types.UPDATE_AGENDAMENTO:
        case types.DELETE_AGENDAMENTO:
            return { ...state, loading: true };

        case types.SET_AGENDAMENTOS:
            return { agendamentos: action.payload, loading: false };

        default:
            return state;
    }
}
