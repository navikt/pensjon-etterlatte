import { useState, useEffect, useRef } from "react";

interface TidNedtellerProps {
    timer?: number;
    minutter?: number;
    sekunder?: number;
    visTimer?: boolean;
    naarFerdig?: () => void;
}

const Nedteller = ({ timer = 0, minutter = 1, sekunder = 0, visTimer = true, naarFerdig }: TidNedtellerProps) => {
    const tidRef = useRef([timer, minutter, sekunder]);
    const nedtellerRef = useRef<number>();
    const [, setCount] = useState<number>(0);

    const tick = () => {
        const [tmr, mins, sek] = tidRef.current;

        if (tmr === 0 && mins === 0 && sek === 0) {
            clearInterval(nedtellerRef.current);
            tidRef.current = [0, 0, 0];
            if (naarFerdig) {
                naarFerdig();
            }
        } else if (mins === 0 && sek === 0) {
            tidRef.current = [tmr - 1, 59, 59];
        } else if (sek === 0) {
            tidRef.current = [tmr, mins - 1, 59];
        } else {
            tidRef.current = [tmr, mins, sek - 1];
        }
    };

    // const restart = () => tidRef.current = [timer, minutter, sekunder]; Kan være aktuelt å ha med til senere

    useEffect(() => {
        const NedtellerId = window.setInterval(() => {
            tick();
            setCount((count) => count + 1);
        }, 1000);
        nedtellerRef.current = NedtellerId;
        return () => {
            clearInterval(nedtellerRef.current);
        };
    }, [nedtellerRef, timer, minutter, sekunder]);

    useEffect(() => {
        tidRef.current = [timer, minutter, sekunder];
    }, [timer, minutter, sekunder]);

    return (
        <>
            {`${visTimer ? tidRef.current[0].toString().padStart(2, "0") + ":" : ""}${tidRef.current[1]
                .toString()
                .padStart(2, "0")}:${tidRef.current[2].toString().padStart(2, "0")}`}
        </>
    );
};

export default Nedteller;
