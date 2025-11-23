import { CampoFormulario } from '@/modais/ModalFormulario';
import { setModalFormulario } from '@/redux/actions/actionsModais';
import { useAppDispatch } from './useRedux';

export const useModalFormulario = () => {
    const dispatch = useAppDispatch();

    const abrirFormulario = (
        titulo: string,
        campos: CampoFormulario[],
        opcoes: {
            textoBotaoConfirmar?: string;
            textoBotaoCancelar?: string;
            onConfirmar: (valores: Record<string, string>) => void;
            onCancelar?: () => void;
        }
    ) => {
        dispatch(setModalFormulario({
            statusAtivo: true,
            titulo,
            campos,
            textoBotaoConfirmar: opcoes.textoBotaoConfirmar || 'Salvar',
            textoBotaoCancelar: opcoes.textoBotaoCancelar || 'Cancelar',
            onConfirmar: opcoes.onConfirmar,
            onCancelar: opcoes.onCancelar,
        }));
    };

    return {
        abrirFormulario,
    };
};
