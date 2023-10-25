import { axiosInstance as api } from "./axios";
import { ISoeknad } from "../context/soknad/soknad";
import { SoeknadRequest } from "./dto/InnsendtSoeknad";

/**
 * Henter personalia for innlogget person
 */
export const hentInnloggetPerson = async () => {
    try {
        const response = await api.get("/api/person/innlogget");
        return response.data;
    } catch (e) {
        throw new Error("Det skjedde en feil");
    }
};

export const hentUtloepstidForInnlogging = async () => {
    try {
        const response = await api.get("/session");
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
        const response: any = await api.get("/api/api/kladd");
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
        const response = await api.delete("/api/api/kladd");
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
        const response = await api.post("/api/api/kladd", body);
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
        const response = await api.post("/api/api/soeknad", body);
        return response.status;
    } catch (e) {
        throw new Error(`Det skjedde en feil: ${getErrorMessage(e)}`);
    }
};

/**
 * Henter liste over land
 */
export const hentLand = async () => {
    try {
        const response = await api.get("/api/kodeverk/alleland");
        return response.data;
    } catch (e) {
        throw new Error(`Det skjedde en feil: ${getErrorMessage(e)}`);
    }
};

export const loggFunc = (data: any) => api.post('/logg', data)

const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) return error.message
    else return String(error)
}