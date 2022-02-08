import { axiosInstance as api } from './axios'

export const getLoggedInUser = async () => api.get('/api/person/innlogget').then((response) => response.data)
