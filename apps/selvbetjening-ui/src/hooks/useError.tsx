import { ActionTypes } from "../context/soknad/soknad";
import { useSoknadContext } from "../context/soknad/SoknadContext";

// let timer: any = null;
export const useError = () => {
    const { dispatch } = useSoknadContext();

    const setError = (errorMsg: string | null) => {
        // TODO: Hvordan ønsker vi å vise globale feilmeldinger?
        /* clearTimeout(timer);
        timer = setTimeout(() => {
            dispatch({
                type: ActionTypes.SET_ERROR,
                payload: null,
            });
        }, 10000);*/
        dispatch({
            type: ActionTypes.SET_ERROR,
            payload: errorMsg,
        });
    };

    return { setError };
};
