import axios from "axios";

const api = axios.create({
    withCredentials: true,
    baseURL: "/api",
});

export const hentInnloggetPerson = () => {
    return api.get("/person/innlogget")
        .then((response) => {
            console.log(response);

            return response.data;
        });
};

export const sendSoeknad = (soeknad: object) => {
    return api
        .post("/api/soeknad", soeknad)
        .then((response) => {
            if (response.status !== 200) {
                throw new Error()
            }

            return response.data;
        });
};

export const isReady = () => {
    return api
        .get("/internal/isready")
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.error(error);
        });
};

export const isAlive = () => {
    return api
        .get("/internal/isalive")
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.error(error);
        });
};
