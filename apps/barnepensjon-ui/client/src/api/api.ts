import { axiosInstance as api } from "./axios";

export const hentInnloggetPerson = async () => {
    try {
        const response = await api.get("/api/person/innlogget");
        return response.data;
    } catch (e) {
        throw new Error("Det skjedde en feil");
    }
};
