import { all, fork } from "redux-saga/effects";
import sagasAgendamentos from "./sagas/sagasAgendamento";
import sagasAssistente from "./sagas/sagasAssistente";
import sagasClientes from "./sagas/sagasClient";
import sagasObservacoes from "./sagas/sagasObservacao";
import sagasRelatorios from "./sagas/sagasRelatorio";
import sagasServicos from "./sagas/sagasServico";
import sagasUsuario from "./sagas/sagasUsuario";

export default function* rootSaga(): Generator<any, void, any> {
    yield all([
        fork(sagasUsuario),
        fork(sagasServicos),
        fork(sagasClientes),
        fork(sagasAgendamentos),
        fork(sagasRelatorios),
        fork(sagasObservacoes),
        fork(sagasAssistente),
    ]);
}
