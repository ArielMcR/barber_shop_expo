import { combineReducers } from 'redux';
import { clientReducer } from './reducers/clientReducer';
import { empresaReducer } from './reducers/empresaReducer';
import { modalReducer } from './reducers/modaisReducer';
import { servicoReducer } from './reducers/servicoReducer';
import usuarioReducer from './reducers/usuarioReducer';

export const rootReducer = combineReducers({
    usuario: usuarioReducer,
    modais: modalReducer,
    servicos: servicoReducer,
    clientes: clientReducer,
    empresa: empresaReducer,
})