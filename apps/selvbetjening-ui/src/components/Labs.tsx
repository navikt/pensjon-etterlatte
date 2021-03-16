import { FC } from "react";
import axios from "axios";

const api = axios.create({
    withCredentials: true,
});

const isReady = () => {
    api.get("/api/internal/isready")
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.error(error);
        });
};

const isAlive = () => {
    api.get("/api/internal/isalive")
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
