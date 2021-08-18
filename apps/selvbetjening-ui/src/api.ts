import axios from "axios";
import axiosRetry from 'axios-retry';

const api = axios.create({
    withCredentials: true,
    baseURL: "/api",
});

axiosRetry(api, {
    retries: 3,
    retryDelay: (retryCount: number) => process.env.NODE_ENV === 'development' ? 500 : retryCount * 2000,
    // Foreløpig begrenset til kun å gjelde sendSoeknad.
    // Må ta stilling til om vi kan få problemer med idempotens/timeout.
    retryCondition: () => true
});

/**
 * Henter personalia for innlogget person
 */
export const hentInnloggetPerson = () => {
    return api.get("/person/innlogget")
        .then((response) => {
            console.log(response);

            return response.data;
        });
};

/**
 * Henter søknad fra APIet basert på innlogget bruker sitt fnr.
 */
export const hentSoeknad = () => {
    return api.get("/api/soeknad")
        .then((response) => {
            if (response.status !== 200) {
                throw new Error()
            }

            return response.data;
        });
};

/**
 * Lagrer søknad via APIet på innlogget bruker sitt fnr.
 *
 * Skal gi Søknad ID i retur ved lagring ok
 */
export const lagreSoeknad = (soeknad: object) => {
    return api.post("/api/soeknad", soeknad)
        .then((response) => {
            if (response.status !== 200) {
                throw new Error()
            }

            return response.data;
        });
};

/**
 * Sender inn ferdigstilt søknad
 */
export const sendSoeknad = (soeknad: object) => {
    return api.post("/api/soeknad", soeknad)
        .then((response) => {
            if (response.status !== 200) {
                throw new Error()
            }

            return response.data;
        });
};
