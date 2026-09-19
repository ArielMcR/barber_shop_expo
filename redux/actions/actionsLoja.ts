import { types } from "../types/typesLoja";

export const setLoja = (loja: any) => ({
    type: types.SET_LOJA,
    payload: loja,
});

export const clearLoja = () => ({
    type: types.CLEAR_LOJA,
});
