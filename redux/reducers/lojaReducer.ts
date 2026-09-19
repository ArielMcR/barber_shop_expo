import { types } from '../types/typesLoja';

const initialState = {
    loja: null as any,
};

export const lojaReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.SET_LOJA:
            return { ...state, loja: action.payload };
        case types.CLEAR_LOJA:
            return { ...state, loja: null };
        default:
            return state;
    }
}
