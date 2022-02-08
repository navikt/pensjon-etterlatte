import axios from "axios";
import axiosRetry from "axios-retry";

const isDev = process.env.NODE_ENV === "development";

export const baseURL = isDev
    ? `http://localhost:8085${process.env.PUBLIC_URL}`
    : "/barnepensjon/soknad";

export const axiosInstance = axios.create({
    withCredentials: true,
    baseURL
});

axiosRetry(axiosInstance, {
    retries: 3,
    retryDelay: (retryCount: number) => (isDev ? 500 : retryCount * 2000),
    // Må ta stilling til om vi kan få problemer med idempotens/timeout.
    retryCondition: (error) => error.response?.status !== 404 && error.response?.status !== 409,
});
