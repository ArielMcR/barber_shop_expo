import { types } from "../types/typesObservacao";

const initialState = {
    observations: [],
}

export const observacaoReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.SET_OBSERVATIONS:
            return {
                ...state,
                observations: action.payload,
            };
        default:
            return state;
    }
}
