import { axiosInstance as api } from './axios'

export const hentInnloggetPerson = async () =>
    api
        .get('/api/person/innlogget')
        .then((response) => response.data)
        .catch((e) => {
            throw new Error('feil')
        })
