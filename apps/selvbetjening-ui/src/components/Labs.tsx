import { FC } from "react";
import { hentInnloggetPerson, hentPerson, isAlive, isReady, secure, sendSoeknad } from "../api";

const Labs: FC = () => {
    const send = () => {
        const soeknad = {
            avdod: {
                navn: "RASK SPAGHETTI",
                fnr: "01010122222",
                mottokPensjonFraAndreLand: {
                    svar: "Ja",
                    beløp: "NOK 20 000,-",
                },
            },
        };

        sendSoeknad(soeknad);
    };

    return (
        <>
            <h1>Selvbetjening API</h1>
            <button onClick={isReady}>isready</button>
            <button onClick={isAlive}>isalive</button>
            <button onClick={hentPerson}>hentPerson</button>
            <button onClick={hentInnloggetPerson}>hentInnloggetPerson</button>
            <button onClick={secure}>secure</button>
            <button onClick={send}>sendSoeknad</button>
        </>
    );
};

export default Labs;
