import { types } from "../types/typesServico";

export const requestServico = () => ({
    type: types.REQUEST_SERVICOS,
});
export const createServico = (servico: any) => ({
    type: types.CREATE_SERVICO,
    payload: servico,
});
export const setServico = (servicos: any) => ({
    type: types.SET_SERVICO,
    payload: servicos,
});
export const deleteServico = (id: any) => ({
    type: types.DELETE_SERVICO,
    payload: id,
});
export const updateServico = (servico: any) => ({
    type: types.UPDATE_SERVICO,
    payload: servico,
});