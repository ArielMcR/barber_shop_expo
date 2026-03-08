import { types } from '../types/typesEmpresa';

interface CredenciaisTemp {
    usuario: string;
    senha: string;
}

const initialState = {
    empresa: null as any,
    empresas: [] as any[],
    credenciaisTemp: null as CredenciaisTemp | null,
};

export const empresaReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.SET_EMPRESA:
            return { ...state, empresa: action.payload };
        case types.CLEAR_EMPRESA:
            return { ...state, empresa: null };
        case types.SET_EMPRESAS:
            return { ...state, empresas: action.payload };
        case types.CLEAR_EMPRESAS:
            return { ...state, empresas: [] };
        case types.SET_CREDENCIAIS_TEMP:
            return { ...state, credenciaisTemp: action.payload };
        case types.CLEAR_CREDENCIAIS_TEMP:
            return { ...state, credenciaisTemp: null };
        default:
            return state;
    }
}