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
        default:
            return state;
    }
}


