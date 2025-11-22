import { types } from "../types/typesCliente";

const initialState = {
    clients: [],
}

export const clientReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.SET_CLIENTS:
            return {
                ...state,
                clients: action.payload,
            };
        default:
            return state;
    }
}