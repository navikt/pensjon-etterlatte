import axios, { AxiosError } from "axios";

const er401Feil = (error: AxiosError) => error && error.response && error.response.status === 401;

// const loggInn = () => !erLokaltMedMock();

const getRedirectUrl = () => {
    return window.location.origin + process.env.PUBLIC_URL;
};

const getLoginUrl = () => {
    return process.env.REACT_APP_LOGIN_SERVICE + "&redirect=" + getRedirectUrl();
};

export const autentiseringsInterceptor = () => {
    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        (error: AxiosError) => {
            // if (er401Feil(error) && loggInn()) {
            if (er401Feil(error)) {
                window.location.href = getLoginUrl();
            } else {
                throw error;
            }
        }
    );
};

export const verifiserAtBrukerErAutentisert = (settAutentisering: (autentisering: boolean) => void) => {
    // if (loggInn()) {
    if (true) {
        return verifiserInnloggetApi().then((response) => {
            if (response && 200 === response.status) {
                settAutentisering(true);
            }
        });
    } else {
        settAutentisering(true);
    }
};

const verifiserInnloggetApi = () => {
    return axios.get(`${process.env.REACT_APP_SELVBETJENING_API}/api/innlogget`, {
        withCredentials: true,
    });
};
