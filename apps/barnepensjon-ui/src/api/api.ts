import { IApplication } from '../context/application/application'
import { axiosInstance as api } from './axios'
import { SoeknadRequest, SoeknadType } from './dto/InnsendtSoeknad'

export const getLoggedInUser = async (type: SoeknadType) =>
    api.get(`/api/person/innlogget?soeknadType=${type}`).then((res) => res.data)

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
