import { CampoFormulario } from "@/modais/ModalFormulario";
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

export const setModalFormulario = (payload: {
    statusAtivo: boolean;
    titulo: string;
    campos: CampoFormulario[];
    textoBotaoConfirmar?: string;
    textoBotaoCancelar?: string;
    onConfirmar?: (valores: Record<string, string>) => void;
    onCancelar?: () => void;
}) => ({
    type: types.SET_MODAL_FORMULARIO,
    payload
});