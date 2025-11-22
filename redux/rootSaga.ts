import { all, fork } from "redux-saga/effects";
import sagasClientes from "./sagas/sagasClient";
import sagasServicos from "./sagas/sagasServico";
import sagasUsuario from "./sagas/sagasUsuario";

export default function* rootSaga(): Generator<any, void, any> {
    yield all([
        fork(sagasUsuario),
        fork(sagasServicos),
        fork(sagasClientes),
    ]);
}
