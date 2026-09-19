import api from "@/services/api";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { setAgendamentos } from "../actions/actionsAgendamento";
import { setModalAviso } from "../actions/actionsModais";
import { types } from "../types/typesAgendamento";

import { TODOS_SLOTS } from "@/utils/constants";
import { paraDataLocalISO } from "@/utils/conversorData";

const calcEndTime = (startTime: string, durationMinutes: number): string => {
    const [h, m] = startTime.split(':').map(Number);
    const totalMin = h * 60 + m + durationMinutes;
    return `${String(Math.floor(totalMin / 60)).padStart(2, '0')}:${String(totalMin % 60).padStart(2, '0')}`;
};

const emReais = (valor: number) => `R$ ${Number(valor).toFixed(2).replace('.', ',')}`;

/**
 * Um agendamento tem 1..N serviços (`apt.services`), cada item com preço e
 * duração congelados na marcação. A tela mostra um "serviço" só, então aqui os
 * itens viram um resumo: nomes concatenados, duração somada e valor somado.
 *
 * Usa os valores congelados do item, não o cadastro atual do serviço — é o que
 * o cliente vai pagar.
 */
const resumirServicos = (itens: any[]) => {
    const lista = itens ?? [];
    const duracaoMin = lista.reduce((t, i) => t + (i.durationMinutes ?? 0), 0);
    const valor = lista.reduce((t, i) => t + (i.unitPrice ?? 0), 0);

    return {
        nome: lista.map((i) => i.service?.name).filter(Boolean).join(' + ') || 'Serviço',
        preco: emReais(valor),
        duracao: `${duracaoMin} min`,
        duracaoMin,
        // Lista original, para o modal de detalhe abrir item a item.
        itens: lista.map((i) => ({
            id: i.serviceId,
            nome: i.service?.name,
            preco: emReais(i.unitPrice ?? 0),
            duracao: `${i.durationMinutes ?? 0} min`,
        })),
    };
};

// Adiciona campo `nome` ao cliente para uso na tela de agendamentos
const adaptarCliente = (c: any) => ({
    ...c,
    nome: `${c.name}${c.lastName ? ' ' + c.lastName : ''}`,
});

// Converte um appointment da API em um ou mais slots (para serviços com duração > 30min)
const appointmentParaSlots = (apt: any): { data: string; slots: any[] } => {
    // Local, não UTC: o back-end grava appointmentDate à meia-noite local, e
    // ler em UTC devolveria o dia anterior/seguinte dependendo da hora.
    const data = paraDataLocalISO(new Date(apt.appointmentDate));
    const startTime: string = apt.startTime;
    // Duração é a SOMA dos serviços — o back-end já grava somado em
    // durationMinutes, mas recalcular pelos itens evita depender disso.
    const servico = resumirServicos(apt.services);
    const durationMin: number = servico.duracaoMin || apt.durationMinutes || 30;
    const slotsNecessarios = Math.ceil(durationMin / 30);
    const indexInicio = TODOS_SLOTS.indexOf(startTime);

    const cliente = adaptarCliente(apt.client);

    const slots: any[] = [
        { id: apt.id, horario: startTime, cliente, servico, duracaoMin: durationMin, status: apt.status },
    ];

    for (let i = 1; i < slotsNecessarios; i++) {
        const idx = indexInicio + i;
        if (idx < TODOS_SLOTS.length) {
            slots.push({
                id: apt.id,
                horario: TODOS_SLOTS[idx],
                cliente,
                servico,
                duracaoMin: durationMin,
                ocupadoPor: startTime,
                status: apt.status,
            });
        }
    }

    return { data, slots };
};

// Agrupa appointments da API por data, gerando a estrutura Record<string, slots[]>
const agruparPorData = (appointments: any[]): Record<string, any[]> => {
    const result: Record<string, any[]> = {};
    for (const apt of appointments) {
        const { data, slots } = appointmentParaSlots(apt);
        if (!result[data]) result[data] = [];
        result[data].push(...slots);
    }
    return result;
};

function* requestAgendamentos(): Generator<any, void, any> {
    try {
        const { data: appointments } = yield call(api.get, '/appointments');
        yield put(setAgendamentos(agruparPorData(appointments)));
    } catch (error: any) {
        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'erro',
            mensagem: 'Erro ao buscar agendamentos. Tente novamente mais tarde.',
            textAlign: 'center',
            onPress: () => { },
            onPressCancel: () => { },
            textoBotao: 'OK',
            desabilitaFecharPorTouch: false,
            textoBotaoCancelar: '',
            textoBotaoConfirmar: '',
            inverterCoresBotaoInfo: false,
        }));
    }
}

function* createAgendamento(action: any): Generator<any, void, any> {
    try {
        const usuario = yield select((state: any) => state.usuario.usuario);
        const { clientId, serviceIds, horario, data, durationMinutes } = action.payload;

        yield call(api.post, '/appointments', {
            clientId,
            // 1..N serviços. O back-end soma as durações e calcula o endTime;
            // mandamos o nosso só como referência.
            serviceIds,
            professionalId: usuario.id,
            appointmentDate: `${data}T00:00:00.000Z`,
            startTime: horario,
            endTime: calcEndTime(horario, durationMinutes),
            status: 'SCHEDULED',
        });

        yield requestAgendamentos();
    } catch (error: any) {
        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'erro',
            mensagem: 'Erro ao criar agendamento. ' + (error?.message || ''),
            textAlign: 'center',
            onPress: () => { },
            onPressCancel: () => { },
            textoBotao: 'OK',
            desabilitaFecharPorTouch: false,
            textoBotaoCancelar: '',
            textoBotaoConfirmar: '',
            inverterCoresBotaoInfo: false,
        }));
    }
}

function* updateAgendamento(action: any): Generator<any, void, any> {
    try {
        const { id, ...data } = action.payload;
        // PATCH, não PUT: o back-end só declara @Patch(':id') — PUT devolve 404
        // "Cannot PUT /appointments/:id".
        yield call(api.patch, `/appointments/${id}`, data);
        yield requestAgendamentos();
    } catch (error: any) {
        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'erro',
            mensagem: 'Erro ao atualizar agendamento. ' + (error?.message || ''),
            textAlign: 'center',
            onPress: () => { },
            onPressCancel: () => { },
            textoBotao: 'OK',
            desabilitaFecharPorTouch: false,
            textoBotaoCancelar: '',
            textoBotaoConfirmar: '',
            inverterCoresBotaoInfo: false,
        }));
    }
}

function* concluirAgendamento(action: any): Generator<any, void, any> {
    try {
        yield call(api.post, `/appointments/${action.payload}/complete`, {});
        yield requestAgendamentos();
    } catch (error: any) {
        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'erro',
            mensagem: 'Erro ao concluir agendamento. ' + (error?.message || ''),
            textAlign: 'center',
            onPress: () => { },
            onPressCancel: () => { },
            textoBotao: 'OK',
            desabilitaFecharPorTouch: false,
            textoBotaoCancelar: '',
            textoBotaoConfirmar: '',
            inverterCoresBotaoInfo: false,
        }));
    }
}

function* deleteAgendamento(action: any): Generator<any, void, any> {
    try {
        yield call(api.delete, `/appointments/${action.payload}`);
        yield requestAgendamentos();
    } catch (error: any) {
        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'erro',
            mensagem: 'Erro ao cancelar agendamento. ' + (error?.message || ''),
            textAlign: 'center',
            onPress: () => { },
            onPressCancel: () => { },
            textoBotao: 'OK',
            desabilitaFecharPorTouch: false,
            textoBotaoCancelar: '',
            textoBotaoConfirmar: '',
            inverterCoresBotaoInfo: false,
        }));
    }
}

export default function* sagasAgendamentos() {
    yield takeLatest(types.REQUEST_AGENDAMENTOS, requestAgendamentos);
    yield takeLatest(types.CREATE_AGENDAMENTO, createAgendamento);
    yield takeLatest(types.UPDATE_AGENDAMENTO, updateAgendamento);
    yield takeLatest(types.DELETE_AGENDAMENTO, deleteAgendamento);
    yield takeLatest(types.CONCLUIR_AGENDAMENTO, concluirAgendamento);
}
