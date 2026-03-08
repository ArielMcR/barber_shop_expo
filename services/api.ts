import store from '@/redux/store';
import axios from 'axios';
import { CONEXAO } from '../utils/constants';

const api = axios.create({
    baseURL: `${CONEXAO.IP}:${CONEXAO.PORTA}`,
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

export default {
    post: (endpoint: string, data: any, config = {}) => api.post(endpoint, data, config),
    get: (endpoint: string) => api.get(endpoint),
    put: (endpoint: string, data: any, config = {}) => api.put(endpoint, data, config),
    delete: (endpoint: string) => api.delete(endpoint),
};