import { combineReducers } from 'redux';
import { agendamentoReducer } from './reducers/agendamentoReducer';
import { assistenteReducer } from './reducers/assistenteReducer';
import { clientReducer } from './reducers/clientReducer';
import { lojaReducer } from './reducers/lojaReducer';
import { modalReducer } from './reducers/modaisReducer';
import { observacaoReducer } from './reducers/observacaoReducer';
import { relatorioReducer } from './reducers/relatorioReducer';
import { servicoReducer } from './reducers/servicoReducer';
import usuarioReducer from './reducers/usuarioReducer';

export const rootReducer = combineReducers({
    usuario: usuarioReducer,
    modais: modalReducer,
    servicos: servicoReducer,
    clientes: clientReducer,
    loja: lojaReducer,
    agendamentos: agendamentoReducer,
    relatorios: relatorioReducer,
    observacoes: observacaoReducer,
    assistente: assistenteReducer,
})