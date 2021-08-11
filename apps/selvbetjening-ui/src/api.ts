import axios, { AxiosError } from "axios";
import axiosRetry from 'axios-retry';

const api = axios.create({
    withCredentials: true,
    baseURL: "/api",
});

axiosRetry(api, {
    retries: 3,
    retryDelay: (retryCount: number) => retryCount * 2000,
    // Foreløpig begrenset til kun å gjelde sendSoeknad.
    // Må ta stilling til om vi kan få problemer med idempotens/timeout.
    retryCondition: (error: AxiosError) => error.config.url === "/api/soeknad"
});

export const hentInnloggetPerson = () => {
    return api.get("/person/innlogget")
        .then((response) => {
            console.log(response);

            return response.data;
        });
};

export const sendSoeknad = (soeknad: object) => {
    return api.post("/api/soeknad", soeknad)
        .then((response) => {
            if (response.status !== 200) {
                throw new Error()
            }

            return response.data;
        });
};
