import { types } from "../types/typesAgendamento";

export const requestAgendamentos = () => ({
    type: types.REQUEST_AGENDAMENTOS,
});

export const createAgendamento = (payload: {
    clientId: number;
    /** 1..N serviços — a duração do atendimento é a soma das durações. */
    serviceIds: number[];
    horario: string;
    data: string;
    durationMinutes: number;
}) => ({
    type: types.CREATE_AGENDAMENTO,
    payload,
});

export const updateAgendamento = (payload: {
    id: number;
    clientId?: number;
    serviceIds?: number[];
    startTime?: string;
    endTime?: string;
}) => ({
    type: types.UPDATE_AGENDAMENTO,
    payload,
});

export const deleteAgendamento = (id: number) => ({
    type: types.DELETE_AGENDAMENTO,
    payload: id,
});

export const concluirAgendamento = (id: number) => ({
    type: types.CONCLUIR_AGENDAMENTO,
    payload: id,
});

export const setAgendamentos = (agendamentos: Record<string, any[]>) => ({
    type: types.SET_AGENDAMENTOS,
    payload: agendamentos,
});
