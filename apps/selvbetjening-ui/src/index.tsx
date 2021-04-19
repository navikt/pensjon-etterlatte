import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.less";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { HashRouter as Router, useLocation } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";
import nbLocale from "./assets/locales/nb.json";
import nnLocale from "./assets/locales/nn.json";
import enLocale from "./assets/locales/en.json";

i18next.use(initReactI18next).init({
    resources: {
        nb: {
            translation: nbLocale,
        },
        nn: {
            translation: nnLocale,
        },
        en: {
            translation: enLocale,
        },
    },
    lng: "nb",
    // keySeparator: false,
    nsSeparator: false,
    interpolation: {
        escapeValue: false,
    },
});

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

ReactDOM.render(
    // <React.StrictMode>
    <Router basename={process.env.PUBLIC_URL}>
        <ScrollToTop />
        <App />
    </Router>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
