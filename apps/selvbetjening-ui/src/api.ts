import axios, { AxiosResponse } from "axios";
import axiosRetry from 'axios-retry';
import { ISoeknad } from "./context/soknad/soknad";

const isDev = process.env.NODE_ENV === "development";

const api = axios.create({
    withCredentials: true,
    baseURL: isDev ? "http://localhost:8080/api" : "/api",
});

axiosRetry(api, {
    retries: 3,
    retryDelay: (retryCount: number) => isDev ? 500 : retryCount * 2000,
    // Foreløpig begrenset til kun å gjelde sendSoeknad.
    // Må ta stilling til om vi kan få problemer med idempotens/timeout.
    retryCondition: () => true
});

/**
 * Henter personalia for innlogget person
 */
export const hentInnloggetPerson = () => {
    return api.get("/person/innlogget")
        .then((response: AxiosResponse) => response.data);
};

/**
 * Henter søknad fra APIet basert på innlogget bruker sitt fnr.
 */
export const hentSoeknad = () => {
    return api.get("/api/kladd")
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new Error()
            }

            const soeknad = response.data?.soeknad;

            if (soeknad) return JSON.parse(soeknad)
            else return undefined;
        });
};

export const slettSoeknad = () => {
    return api.delete("/api/kladd")
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new Error();
            }

            return response.data;
        });
}

/**
 * Lagrer søknad via APIet på innlogget bruker sitt fnr.
 *
 * Skal gi Søknad ID i retur ved lagring ok
 */
export const lagreSoeknad = (soeknad: ISoeknad) => {
    const body: ISoeknad = {
        ...soeknad,
        klarForLagring: undefined
    }

    return api.post("/api/kladd", body)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new Error()
            }

            return response.data;
        });
};

/**
 * Sender inn ferdigstilt søknad
 */
export const sendSoeknad = (soeknad: any) => {
    return api.post("/api/soeknad", soeknad)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new Error()
            }

            return response.data;
        });
};
