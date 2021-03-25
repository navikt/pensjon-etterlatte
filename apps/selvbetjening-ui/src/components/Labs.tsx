import { FC } from "react";
import { hentInnloggetPerson, hentPerson, isAlive, isReady, secure } from "../api";

const Labs: FC = () => {
    return (
        <>
            <h1>Selvbetjening API</h1>
            <button onClick={isReady}>isready</button>
            <button onClick={isAlive}>isalive</button>
            <button onClick={hentPerson}>hentPerson</button>
            <button onClick={hentInnloggetPerson}>hentInnloggetPerson</button>
            <button onClick={secure}>secure</button>
        </>
    );
};

export default Labs;
