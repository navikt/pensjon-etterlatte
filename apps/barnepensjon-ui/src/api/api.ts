import { IApplication } from '../context/application/application'
import {axiosInstance as api, isDev} from './axios'
import { SoeknadRequest } from './dto/InnsendtSoeknad'

export const getLoggedInUser = async () => api.get('/api/person/innlogget').then((res) => res.data)

export const getAllCountries = async () => api.get('/api/kodeverk/alleland').then((res) => res.data)

export const getCurrencies = async () => api.get('/api/kodeverk/valutaer').then((res) => res.data)

export const getDraft = async () =>
    api
        .get('/api/api/kladd')
        .then((res) => res.data)
        .then((data) => (!!data?.payload ? JSON.parse(data?.payload) : undefined))
        .catch((e) => {
            if (e.response.status === 404) return undefined
            if (e.response.status === 409) throw new Error('FERDIGSTILT')
            else throw new Error('Det skjedde en feil')
        })

export const saveDraft = async (application: IApplication) =>
    api.post('/api/api/kladd', application).then((res) => res.data)

export const sendApplication = async (application: SoeknadRequest) =>
    api
        .post('/api/api/soeknad', application)
        .then((res) => res.data)
        .catch((e) => {
            if (e.response.status === 409) throw new Error('FERDIGSTILT')
            else throw new Error('Det skjedde en feil')
        })

export const deleteDraft = async () => api.delete('/api/api/kladd').then((res) => res.data)

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