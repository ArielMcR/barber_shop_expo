import { combineReducers } from 'redux';
import { clientReducer } from './reducers/clientReducer';
import { modalReducer } from './reducers/modaisReducer';
import { servicoReducer } from './reducers/servicoReducer';
import usuarioReducer from './reducers/usuarioReducer';
export const rootReducer = combineReducers({
    usuario: usuarioReducer,
    modais: modalReducer,
    servicos: servicoReducer,
    clientes: clientReducer,
})