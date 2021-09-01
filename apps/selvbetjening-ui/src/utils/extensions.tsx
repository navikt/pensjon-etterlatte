import { useEffect, useRef } from "react";

export const useEffectOnce = (
    callback: () => void,
    condition = true
) => {
    const called = useRef(false);

    useEffect(() => {
        if (condition && !called.current) {
            called.current = true;
            callback();
        }
    }, [callback, condition]);
};
