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
