import { CampoFormulario } from "@/modais/ModalFormulario";
import { types } from "../types/typesModais";

const initialState = {
    modal_login: {
        statusAtivo: false,
        mensagem: ''
    },
    modal_aviso: {
        statusAtivo: false,
        tipo: "",
        mensagem: "",
        textAlign: "center",
        onPress: () => { },
        onPressCancel: () => { },
        textoBotao: "",
        desabilitaFecharPorTouch: false,
        textoBotaoCancelar: "",
        textoBotaoConfirmar: "",
        inverterCoresBotaoInfo: false,
    },
    modal_formulario: {
        statusAtivo: false,
        titulo: '',
        campos: [] as CampoFormulario[],
        textoBotaoConfirmar: '',
        textoBotaoCancelar: '',
        onConfirmar: undefined as ((valores: Record<string, string>) => void) | undefined,
        onCancelar: undefined as (() => void) | undefined,
    },
    modal_agendamento: {
        statusAtivo: false,
        horario: '',
        data: '',
        modo: 'novo' as 'novo' | 'trocar_cliente' | 'trocar_servico',
        clienteAtual: null as any,
        servicoAtual: null as any,
    },
}

export const modalReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.SET_MODAL_LOGIN:
            return {
                ...state,
                modal_login: action.payload
            };
        case types.SET_MODAL_AVISO:
            return {
                ...state,
                modal_aviso: action.payload
            };
        case types.SET_MODAL_FORMULARIO:
            return {
                ...state,
                modal_formulario: action.payload
            };
        case types.SET_MODAL_AGENDAMENTO:
            return {
                ...state,
                modal_agendamento: action.payload
            };
        default:
            return state;
    }
}


