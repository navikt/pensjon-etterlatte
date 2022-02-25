import { axiosInstance as api } from './axios'
import { IApplication } from '../context/application/application'

export const getLoggedInUser = async () => api.get('/api/person/innlogget').then((res) => res.data)

export const getAllCountries = async () => api.get('/api/kodeverk/alleland').then((res) => res.data)

// TODO: Handle response and convert to json
export const getDraft = async () =>
    api
        .get('/api/api/kladd')
        .then((res) => res.data)
        .then((data) => (!!data ? JSON.parse(data) : undefined))
        .catch((e) => {
            switch (e.response.status) {
                case 404:
                    return undefined
                case 409:
                    throw new Error('FERDIGSTILT')
                default:
                    throw new Error('Det skjedde en feil')
            }
        })

export const saveDraft = async (application: IApplication) => api.post('/api/api/', application).then((res) => res.data)

export const deleteDraft = async () => api.delete('/api/api/').then((res) => res.data)
