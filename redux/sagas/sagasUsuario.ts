
import api from '@/services/api';
import navigationService from '@/services/navigationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { call, put, takeLatest } from 'redux-saga/effects';
import { setModalAviso } from '../actions/actionsModais';
import { clearUsuario, setUsuario } from '../actions/actionsUsuario';
import { types as typesLoja } from '../types/typesLoja';
import { types } from '../types/typesUsuario';

const loginAPI = async (credentials: { name: string; password: string }) => {
    console.log("loginAPI", credentials);
    console.log("loginAPI", api.baseURL);
    const { data: dados } = await api.post('/auth/login', credentials);
    return dados;
};

function* validarLogin(): Generator<any, void, any> {
    try {
        const token = yield call(AsyncStorage.getItem, 'userToken');
        const userData = yield call(AsyncStorage.getItem, 'userData');

        if (!token || !userData) {
            yield put(clearUsuario());
            navigationService.replace('/login');
            return;
        }

        const usuarioSalvo = JSON.parse(userData);
        yield put(setUsuario({ ...usuarioSalvo, token }));

        const { data: dados } = yield call(api.get, '/auth/me');

        const usuarioAtualizado = { ...usuarioSalvo, ...dados.user, token };
        yield call(AsyncStorage.setItem, 'userData', JSON.stringify(usuarioAtualizado));
        yield put(setUsuario(usuarioAtualizado));

        if (dados.settings) {
            yield put({ type: typesLoja.SET_LOJA, payload: dados.settings });
        }

        navigationService.replace('/(drawer)/(tabs)');
    } catch (error) {
        yield call(AsyncStorage.removeItem, 'userToken');
        yield call(AsyncStorage.removeItem, 'userData');
        yield put(clearUsuario());
        navigationService.replace('/login');
    }
}

function* realizarLogin(action: ReturnType<typeof import('../actions/actionsUsuario').realizarLogin>): Generator<any, void, any> {
    try {
        console.log("dados de login", action.login);

        const resposta = yield call(loginAPI, action.login);

        yield call(AsyncStorage.setItem, 'userToken', resposta.access_token);
        yield call(AsyncStorage.setItem, 'userData', JSON.stringify(resposta.user));
        yield put(setUsuario({ ...resposta.user, token: resposta.access_token }));
        yield put({ type: typesLoja.SET_LOJA, payload: resposta.settings });

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
        yield put({ type: typesLoja.CLEAR_LOJA });

        navigationService.replace('/login');
    } catch (error) {
        console.error('Erro ao deslogar:', error);
    }
}

export default function* usuarioSaga() {
    yield takeLatest(types.VALIDAR_LOGIN, validarLogin);
    yield takeLatest(types.REALIZAR_LOGIN, realizarLogin);
    yield takeLatest(types.DESLOGAR_USUARIO, deslogarUsuario);
}