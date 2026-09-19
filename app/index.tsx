import { useAppDispatch } from '@/hooks/useRedux';
import { validaLogin } from '@/redux/actions/actionsUsuario';
import { useEffect } from 'react';
import Loader from './Loader';

export default function Index() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(validaLogin());
    }, []);

    return <Loader />;
}
