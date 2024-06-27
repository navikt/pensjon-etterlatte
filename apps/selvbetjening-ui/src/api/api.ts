import {axiosInstance as api, isDev} from './axios'

/*
export const getLoggedInUser = async (type: SoeknadType) =>
        api.get(`/api/person/innlogget?soeknadType=${type}`)
                .then((res) => res.data)
*/

export const loggFunc = async (message: string) => {
    if (isDev) {
        console.log(`Logging til pod er deaktivert for lokal kjøring, returnerer uten å logge dit. Meldinga var: ${message}`)
        return
    }

    try {
        const response = await api.post("/api/logg", {message: message});
        return response.status;
    } catch (e) {
        throw new Error(`Det skjedde en feil: ${e}`);
    }
};