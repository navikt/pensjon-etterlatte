import { FC } from "react";
import axios from "axios";

const apiUrl = process.env.REACT_APP_SELVBETJENING_API;

console.log(`Api url: ${apiUrl}`);

const isReady = () => {
    axios
        .get(`${apiUrl}/internal/isready`, {
            withCredentials: true,
        })
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.error(error);
        });
};

const isAlive = () => {
    axios
        .get(`${apiUrl}/internal/isalive`, {
            withCredentials: true,
        })
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.error(error);
        });
};

const Labs: FC = () => {
    return (
        <>
            <h1>Selvbetjening API</h1>
            <button onClick={isReady}>isready</button>
            <button onClick={isAlive}>isalive</button>
        </>
    );
};

export default Labs;
