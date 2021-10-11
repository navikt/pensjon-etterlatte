import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
//import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
//import * as serviceWorker from "./serviceWorker";
import "./i18n";
import ContextProviders from "./context/ContextProviders";

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

        <div className={"app"}>
            <ContextProviders>
                <App />
            </ContextProviders>
        </div>
    </Router>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
