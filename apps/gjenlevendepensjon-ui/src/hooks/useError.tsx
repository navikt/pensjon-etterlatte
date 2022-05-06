import { useEffect, useState } from "react";
import { ActionTypes } from "../context/soknad/soknad";
import { useSoknadContext } from "../context/soknad/SoknadContext";

let timer: any = null;
export const useError = () => {
    const [message, setMessage] = useState<null | string>(null);
    const { dispatch } = useSoknadContext();

    const clearMessage = () => {
        setMessage(null);
    };

    useEffect(() => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            clearMessage();
        }, 10000);
        dispatch({
            type: ActionTypes.SET_ERROR,
            payload: message,
        });
    }, [message]);

    const setError = (errorMsg: string | null) => {
        setMessage(errorMsg);
    };

    return { setError, message };
};
