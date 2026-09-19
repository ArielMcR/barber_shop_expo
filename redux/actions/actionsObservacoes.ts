import { types } from "../types/typesObservacao";

export const requestObservations = (clientId: number) => ({
    type: types.REQUEST_OBSERVATIONS,
    payload: clientId,
});
export const setObservations = (observations: any) => ({
    type: types.SET_OBSERVATIONS,
    payload: observations,
});
export const createObservation = (observation: any) => ({
    type: types.CREATE_OBSERVATION,
    payload: observation,
});
export const updateObservation = (observation: any) => ({
    type: types.UPDATE_OBSERVATION,
    payload: observation,
});
export const deleteObservation = (payload: { id: number; clientId: number }) => ({
    type: types.DELETE_OBSERVATION,
    payload,
});
