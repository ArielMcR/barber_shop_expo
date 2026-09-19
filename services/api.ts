import store from '@/redux/store';
import axios from 'axios';
import { CONEXAO } from '../utils/constants';

const obterMensagemDoBody = (data: any): string | null => {
    if (!data) return null;
    if (typeof data === 'string') return data;
    if (typeof data.message === 'string' && data.message.trim()) return data.message;
    if (typeof data.error === 'string' && data.error.trim()) return data.error;
    if (Array.isArray(data.errors) && data.errors.length > 0) {
        const primeiroErro = data.errors[0];
        if (typeof primeiroErro === 'string') return primeiroErro;
        if (typeof primeiroErro?.message === 'string' && primeiroErro.message.trim()) {
            return primeiroErro.message;
        }
    }
    return null;
};

const api = axios.create({
    baseURL: CONEXAO.URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = store.getState().usuario.usuario?.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error)) {
            const data = error.response?.data;
            const mensagemBody = obterMensagemDoBody(data);

            // Mantem o erro Axios original, mas com message amigavel quando backend envia detalhes.
            if (mensagemBody) {
                error.message = mensagemBody;
            }
        }

        return Promise.reject(error);
    }
);

export default {
    post: (endpoint: string, data: any, config = {}) => api.post(endpoint, data, config),
    get: (endpoint: string) => api.get(endpoint),
    put: (endpoint: string, data: any, config = {}) => api.put(endpoint, data, config),
    patch: (endpoint: string, data: any, config = {}) => api.patch(endpoint, data, config),
    delete: (endpoint: string) => api.delete(endpoint),
    baseURL: api.defaults.baseURL,
};