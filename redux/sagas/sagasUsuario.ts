
import navigationService from '@/services/navigationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { call, put, takeLatest } from 'redux-saga/effects';
import { setModalAviso } from '../actions/actionsModais';
import { clearUsuario, setUsuario } from '../actions/actionsUsuario';
import { types } from '../types/typesUsuario';

// Simulação de API - substitua pela sua API real
const loginAPI = async (credentials: { usuario: string; senha: string }) => {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulação de login - substitua pela chamada real à API
    if (credentials.usuario == 'admin' && credentials.senha == '123') {
        return {
            nome_usuario: 'Administrador',
            cod: 1,
            permissoes: ['admin', 'criar', 'editar', 'deletar'],
            isLoggedIn: true
        };
    }
    throw new Error('Usuário ou senha inválidos');
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
        const usuario = yield call(loginAPI, action.login);

        // Salva no AsyncStorage
        yield call(AsyncStorage.setItem, 'userToken', 'fake-token-123');
        yield call(AsyncStorage.setItem, 'userData', JSON.stringify(usuario));

        yield put(setUsuario(usuario));

        // Navega diretamente pelo saga
        yield put(setModalAviso({
            statusAtivo: true,
            tipo: 'sucesso',
            mensagem: 'Login realizado com sucesso!',
            textAlign: 'center',
            onPress: (() => { }),
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
            error: error.message || 'Erro ao fazer login',
        });
    }
}

function* deslogarUsuario() {
    try {
        yield call(AsyncStorage.removeItem, 'userToken');
        yield call(AsyncStorage.removeItem, 'userData');
        yield put(clearUsuario());

        // Navega de volta para o login
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