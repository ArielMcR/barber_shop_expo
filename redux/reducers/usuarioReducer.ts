import { types } from '../types/typesUsuario';

interface Usuario {
    nome_usuario: string;
    cod: number;
    permissoes: string[];
}

interface UsuarioState {
    usuario: Usuario | null;
    isLoading: boolean;
    isLoggedIn: boolean;
    error: string | null;
}

const initialState: UsuarioState = {
    usuario: null,
    isLoading: false,
    isLoggedIn: false,
    error: null,
};

const usuarioReducer = (state = initialState, action: any): UsuarioState => {
    switch (action.type) {
        case types.VALIDAR_LOGIN:
            return {
                ...state,
                isLoading: true,
                error: null,
            };

        case types.REALIZAR_LOGIN:
            return {
                ...state,
                isLoading: true,
                error: null,
            };

        case types.SET_USUARIO:
            return {
                ...state,
                usuario: action.usuario,
                isLoading: false,
                isLoggedIn: true,
                error: null,
            };

        case types.DESLOGAR_USUARIO:
            return {
                ...state,
                usuario: null,
                isLoggedIn: false,
                isLoading: false,
                error: null,
            };

        case types.CLEAR_USUARIO:
            return initialState;

        case types.LOGIN_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.error,
            };

        default:
            return state;
    }
};

export default usuarioReducer;