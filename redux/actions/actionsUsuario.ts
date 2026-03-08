import { types } from "../types/typesUsuario";

export const validaLogin = () => {
    return {
        type: types.VALIDAR_LOGIN
    }
}
export const realizarLogin = (login: { name: string, password: string, companyId: number | null, unitId: number | null }) => {
    return {
        type: types.REALIZAR_LOGIN,
        login
    }
}

export const deslogarUsuario = () => {
    return {
        type: types.DESLOGAR_USUARIO
    }
}
export const clearUsuario = () => {
    return {
        type: types.CLEAR_USUARIO
    }
}

export const setUsuario = (usuario: { nome_usuario: string, cod: number, permissoes: string[] }) => {
    return {
        type: types.SET_USUARIO,
        usuario
    }
}