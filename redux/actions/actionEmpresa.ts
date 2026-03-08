import { types } from "../types/typesEmpresa";

export const setEmpresas = (empresas: any[]) => ({
    type: types.SET_EMPRESAS,
    payload: empresas,
});

export const clearEmpresas = () => ({
    type: types.CLEAR_EMPRESAS,
});

export const setEmpresa = (empresa: any) => ({
    type: types.SET_EMPRESA,
    payload: empresa,
});

export const clearEmpresa = () => ({
    type: types.CLEAR_EMPRESA,
});