import axios from "axios";
import axiosRetry from "axios-retry";
import { ISoeknad } from "./context/soknad/soknad";

const isDev = process.env.NODE_ENV === "development";

const api = axios.create({
    withCredentials: true,
    baseURL: isDev ? "http://localhost:8080/api" : "/api",
});

axiosRetry(api, {
    retries: 3,
    retryDelay: (retryCount: number) => (isDev ? 500 : retryCount * 2000),
    // Må ta stilling til om vi kan få problemer med idempotens/timeout.
    retryCondition: (error) => error.response?.status !== 404,
});

/**
 * Henter personalia for innlogget person
 */
export const hentInnloggetPerson = async () => {
    try {
        const response = await api.get("/person/innlogget");
        return response.data;
    } catch (e) {
        throw new Error("Det skjedde en feil");
    }
};

/**
 * Henter søknad fra APIet basert på innlogget bruker sitt fnr.
 */
export const hentSoeknad = async () => {
    try {
        const response = await api.get("/api/kladd");
        const soeknad = response.data?.soeknad;
        if (soeknad) return JSON.parse(soeknad);
        else return undefined;
    } catch (e: any) {
        if (e.response.status === 404) {
            return undefined;
        }
        throw new Error("Det skjedde en feil");
    }
};

export const slettSoeknad = async () => {
    try {
        const response = await api.delete("/api/kladd");
        return response.data;
    } catch (e) {
        throw new Error("Det skjedde en feil");
    }
};

/**
 * Lagrer søknad via APIet på innlogget bruker sitt fnr.
 *
 * Skal gi Søknad ID i retur ved lagring ok
 */
export const lagreSoeknad = async (soeknad: ISoeknad) => {
    const body: ISoeknad = {
        ...soeknad,
        klarForLagring: undefined,
    };

    try {
        const response = await api.post("/api/kladd", body);
        return response.data;
    } catch (e) {
        throw new Error("Det skjedde en feil");
    }
};

/**
 * Sender inn ferdigstilt søknad
 */
export const sendSoeknad = async (soeknad: any) => {
    try {
        const response = await api.post("/api/soeknad", soeknad);
        return response.data;
    } catch (e) {
        throw new Error("Det skjedde en feil");
    }
};

export default api;
