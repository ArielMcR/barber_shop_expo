import { types } from "../types/typesServico";

const initialState = {
    servicos: [],
}

export const servicoReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.SET_SERVICO:
            return {
                ...state,
                servicos: action.payload,
            };
        default:
            return state;
    }
}