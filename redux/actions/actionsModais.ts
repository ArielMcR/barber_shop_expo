import types from "../types/typesModais";

export const setModalLogin = (payload: { statusAtivo: boolean; mensagem: string }) => ({
    type: "SET_MODAL_LOGIN",
    payload
});
export const setModalAviso = (payload: {
    statusAtivo: boolean;
    tipo: string;
    mensagem: string;
    textAlign: string;
    onPress: () => void;
    onPressCancel: () => void;
    textoBotao: string;
    desabilitaFecharPorTouch: boolean;
    textoBotaoCancelar: string;
    textoBotaoConfirmar: string;
    inverterCoresBotaoInfo: boolean;
}) => ({
    type: types.SET_MODAL_AVISO,
    payload
});