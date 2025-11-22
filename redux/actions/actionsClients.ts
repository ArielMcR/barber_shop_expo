import { types } from "../types/typesCliente";

export const requestClients = () => ({
    type: types.REQUEST_CLIENTS,
});
export const createClient = (client: any) => ({
    type: types.CREATE_CLIENT,
    payload: client,
});
export const setClients = (clients: any) => ({
    type: types.SET_CLIENTS,
    payload: clients,
});
export const deleteClient = (id: any) => ({
    type: types.DELETE_CLIENT,
    payload: id,
});
export const updateClient = (client: any) => ({
    type: types.UPDATE_CLIENT,
    payload: client,
});