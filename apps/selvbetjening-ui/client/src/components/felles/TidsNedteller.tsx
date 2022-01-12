import { useState, useEffect } from "react";

interface TidNedtellerProps {
    timer?: number;
    minutter?: number;
    sekunder?: number;
    visTimer?: boolean;
}

const TidsNedteller = ({ timer = 0, minutter = 1, sekunder = 0, visTimer = true }: TidNedtellerProps) => {
    const [[tmr, mins, sek], setTid] = useState([timer, minutter, sekunder]);

    const tick = () => {
        if (tmr === 0 && mins === 0 && sek === 0) setTid([0, 0, 0]);
        else if (mins === 0 && sek === 0) {
            setTid([tmr - 1, 59, 59]);
        } else if (sek === 0) {
            setTid([tmr, mins - 1, 59]);
        } else {
            setTid([tmr, mins, sek - 1]);
        }
    };

    // const restart = () => setTid([timer, minutter, sekunder]); Kan være aktuelt å ha med til senere

    useEffect(() => {
        const TidsNedtellerId = setInterval(() => tick(), 1000);
        return () => clearInterval(TidsNedtellerId);
    });

    return (
        <>
            {`${visTimer ? (tmr.toString().padStart(2, "0") + ':') : ''}${mins.toString().padStart(2, "0")}:${sek
                .toString()
                .padStart(2, "0")}`}
        </>
    );
};

export default TidsNedteller;
