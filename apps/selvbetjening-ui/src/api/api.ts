import {axiosInstance as api, isDev} from './axios'
import {IInntektsjustering} from "../inntektsjustering/inntektsjustering";


export const getLoggedInUser = async () =>
        api.get(`/api/person/innlogget`)
                .then((res) => res.data)

export const getInntektsjustering = async () =>
    api.get(`/api/inntektsjustering`)
        .then((res) => res.data)
        .then((data) => (!!data?.payload ? JSON.parse(data?.payload) : undefined))
        .catch((e) => {
            if (e.response.status === 404) return undefined
            else throw new Error('Det skjedde en feil')
        })

export const saveInntektsjustering = async (application: IInntektsjustering) =>
    api.post('/api/inntektsjustering', application).then((res) => res.data)

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