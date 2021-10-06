import { axiosInstance as api } from "./axios";
import { ISoeknad } from "../context/soknad/soknad";

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
        const response: any = await api.get("/api/kladd");
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
    console.log(`process.env.NAIS_APP_IMAGE: ${process.env.NAIS_APP_IMAGE}`);

    const body = {
        ...soeknad,
        klarForLagring: undefined,
        imageTag: process.env.NAIS_APP_IMAGE?.replace(/^.*(selvbetjening-ui.*)/, "$1") || "",
    };

    try {
        const response = await api.post("/api/soeknad", body);
        return response.data;
    } catch (e) {
        throw new Error(`Det skjedde en feil: ${e.message}`);
    }
};
