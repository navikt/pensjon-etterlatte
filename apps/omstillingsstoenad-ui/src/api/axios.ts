import axios from 'axios'
import axiosRetry from 'axios-retry'

export const isDev = import.meta.env.DEV

const baseURL = isDev ? `http://localhost:8080${import.meta.env.BASE_URL}` : import.meta.env.BASE_URL

console.log('baseurl: ', baseURL)
export const axiosInstance = axios.create({
    withCredentials: true,
    baseURL,
})

axiosRetry(axiosInstance, {
    retries: 3,
    retryDelay: (retryCount: number) => (isDev ? 500 : retryCount * 2000),
    // Må ta stilling til om vi kan få problemer med idempotens/timeout.
    retryCondition: (error) => error.response?.status !== 404 && error.response?.status !== 409,
})

axiosInstance.interceptors.response.use(
        response => response,
        error => {
            if (error.response.status === 401){
                window.location.reload()
            }

            return Promise.reject(error)
        }
);
