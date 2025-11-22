import { setModalAviso } from '@/redux/actions/actionsModais';
import { useAppDispatch } from './useRedux';

export const useModalAviso = () => {
    const dispatch = useAppDispatch();

    const mostrarSucesso = (
        mensagem: string,
        opcoes?: {
            textoBotao?: string;
            onPress?: () => void;
        }
    ) => {
        dispatch(setModalAviso({
            statusAtivo: true,
            tipo: 'sucesso',
            mensagem,
            textAlign: 'center',
            onPress: opcoes?.onPress || (() => { }),
            onPressCancel: () => { },
            textoBotao: opcoes?.textoBotao || 'OK',
            desabilitaFecharPorTouch: false,
            textoBotaoCancelar: '',
            textoBotaoConfirmar: '',
            inverterCoresBotaoInfo: false,
        }));
    };

    const mostrarErro = (
        mensagem: string,
        opcoes?: {
            textoBotao?: string;
            onPress?: () => void;
        }
    ) => {
        dispatch(setModalAviso({
            statusAtivo: true,
            tipo: 'erro',
            mensagem,
            textAlign: 'center',
            onPress: opcoes?.onPress || (() => { }),
            onPressCancel: () => { },
            textoBotao: opcoes?.textoBotao || 'OK',
            desabilitaFecharPorTouch: false,
            textoBotaoCancelar: '',
            textoBotaoConfirmar: '',
            inverterCoresBotaoInfo: false,
        }));
    };

    const mostrarAviso = (
        mensagem: string,
        opcoes?: {
            textoBotao?: string;
            onPress?: () => void;
        }
    ) => {
        dispatch(setModalAviso({
            statusAtivo: true,
            tipo: 'aviso',
            mensagem,
            textAlign: 'center',
            onPress: opcoes?.onPress || (() => { }),
            onPressCancel: () => { },
            textoBotao: opcoes?.textoBotao || 'OK',
            desabilitaFecharPorTouch: false,
            textoBotaoCancelar: '',
            textoBotaoConfirmar: '',
            inverterCoresBotaoInfo: false,
        }));
    };

    const mostrarInfo = (
        mensagem: string,
        opcoes?: {
            textoBotao?: string;
            onPress?: () => void;
        }
    ) => {
        dispatch(setModalAviso({
            statusAtivo: true,
            tipo: 'info',
            mensagem,
            textAlign: 'center',
            onPress: opcoes?.onPress || (() => { }),
            onPressCancel: () => { },
            textoBotao: opcoes?.textoBotao || 'OK',
            desabilitaFecharPorTouch: false,
            textoBotaoCancelar: '',
            textoBotaoConfirmar: '',
            inverterCoresBotaoInfo: false,
        }));
    };

    const mostrarConfirmacao = (
        mensagem: string,
        opcoes: {
            textoBotaoConfirmar?: string;
            textoBotaoCancelar?: string;
            onConfirmar: () => void;
            onCancelar?: () => void;
            tipo?: 'sucesso' | 'erro' | 'aviso' | 'info';
        }
    ) => {
        dispatch(setModalAviso({
            statusAtivo: true,
            tipo: opcoes.tipo || 'aviso',
            mensagem,
            textAlign: 'center',
            onPress: opcoes.onConfirmar,
            onPressCancel: opcoes.onCancelar || (() => { }),
            textoBotao: '',
            desabilitaFecharPorTouch: false,
            textoBotaoCancelar: opcoes.textoBotaoCancelar || 'Cancelar',
            textoBotaoConfirmar: opcoes.textoBotaoConfirmar || 'Confirmar',
            inverterCoresBotaoInfo: false,
        }));
    };

    return {
        mostrarSucesso,
        mostrarErro,
        mostrarAviso,
        mostrarInfo,
        mostrarConfirmacao,
    };
};
