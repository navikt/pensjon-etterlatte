import { axiosInstance as api } from "./axios";
import { ISoeknad } from "../context/soknad/soknad";
import { SoeknadRequest } from "./mapper/InnsendtSoeknad";

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
        const soeknad = response.data?.payload;
        if (soeknad) return JSON.parse(soeknad);
        else return undefined;
    } catch (e: any) {
        if (e.response.status === 404) {
            return undefined;
        } else if (e.response.status === 409) {
            throw new Error("FERDIGSTILT");
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
export const sendSoeknad = async (request: SoeknadRequest) => {
    const body = { ...request };

    try {
        const response = await api.post("/api/soeknad", body);
        return response.status;
    } catch (e) {
        throw new Error(`Det skjedde en feil: ${e.message}`);
    }
};

export const hentOppsummering = async (soeknad: any) => {
    const body = {
        ...soeknad,
        klarForLagring: undefined
    };

    try {
        const response = await api.post("/oppsummering", body);
        return response.data;
    } catch (e: any) {
        throw new Error(`Det skjedde en feil: ${e.message}`);
    }
}


/**
 * Henter liste over land
 */
 export const hentLand = async () => {
    try {
        const response = await api.get("/kodeverk/alleland");
        return response.data;
    } catch (e) {
        throw new Error(`Det skjedde en feil: ${e.message}`);
    }
};

export const hentLocales = async (locale: string) => {
    try{
        const response = await api.get(`/locale/${locale}`)
        return response.data;
    } catch(e: any) {
        throw new Error(`Det skjedde en feil: ${e.message}`)
    }
}