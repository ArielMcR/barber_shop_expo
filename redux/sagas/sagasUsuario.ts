
import api from '@/services/api';
import navigationService from '@/services/navigationService';
import { typesRole } from '@/types/typesUsuarioRole';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { call, put, takeLatest } from 'redux-saga/effects';
import { setModalAviso } from '../actions/actionsModais';
import { clearUsuario, setUsuario } from '../actions/actionsUsuario';
import { types as typesEmpresa } from '../types/typesEmpresa';
import { types } from '../types/typesUsuario';

const loginAPI = async (credentials: { name: string; password: string, companyId: number | null, unitId: number | null }) => {
    const { data: dados } = await api.post('/auth/login', credentials);
    return dados;
};

function* validarLogin(): Generator<any, void, any> {
    try {
        const token = yield call(AsyncStorage.getItem, 'userToken');
        const userData = yield call(AsyncStorage.getItem, 'userData');

        if (token && userData) {
            const usuario = JSON.parse(userData);
            yield put(setUsuario(usuario));
        } else {
            yield put(clearUsuario());
        }
    } catch (error) {
        yield put(clearUsuario());
    }
}

function* realizarLogin(action: ReturnType<typeof import('../actions/actionsUsuario').realizarLogin>): Generator<any, void, any> {
    try {
        console.log("dados de login", action.login);

        const resposta = yield call(loginAPI, action.login);
        // console.log("Resposta", resposta);


        const isSuperAdmin = resposta.user?.role === typesRole.SUPER_ADMIN;
        const precisaSelecionarEmpresa = isSuperAdmin && resposta.companies?.length > 0 && !action.login.companyId;

        if (precisaSelecionarEmpresa) {
            yield put({ type: typesEmpresa.SET_EMPRESAS, payload: resposta.companies });
            yield put({ type: typesEmpresa.SET_CREDENCIAIS_TEMP, payload: { name: action.login.name, password: action.login.password } });
            navigationService.replace('/selecao-empresa');
            return;
        }

        yield call(AsyncStorage.setItem, 'userToken', resposta.access_token);
        yield call(AsyncStorage.setItem, 'userData', JSON.stringify(resposta.user));
        yield put(setUsuario(resposta.user));
        yield put({ type: typesEmpresa.SET_EMPRESA, payload: resposta.company });
        yield put({ type: typesEmpresa.CLEAR_CREDENCIAIS_TEMP });

        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'sucesso',
            mensagem: 'Login realizado com sucesso!',
            textAlign: 'center',
            onPress: () => { },
            onPressCancel: () => { },
            textoBotao: 'OK',
            desabilitaFecharPorTouch: false,
            textoBotaoCancelar: '',
            textoBotaoConfirmar: '',
            inverterCoresBotaoInfo: false,
        }));

        navigationService.replace('/(drawer)/(tabs)');
    } catch (error: any) {
        yield put({
            type: types.LOGIN_ERROR,
            error: error.message || 'Usuário ou senha inválidos',
        });
    }
}

function* deslogarUsuario() {
    try {
        yield call(AsyncStorage.removeItem, 'userToken');
        yield call(AsyncStorage.removeItem, 'userData');
        yield put(clearUsuario());


        navigationService.replace('/');
    } catch (error) {
        console.error('Erro ao deslogar:', error);
    }
}

export default function* usuarioSaga() {
    yield takeLatest(types.VALIDAR_LOGIN, validarLogin);
    yield takeLatest(types.REALIZAR_LOGIN, realizarLogin);
    yield takeLatest(types.DESLOGAR_USUARIO, deslogarUsuario);
}