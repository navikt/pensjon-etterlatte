import React from "react";
import { Route, Switch } from "react-router";
import "./App.less";
import SoknadDialog from "./soknad/SoknadDialog";

const App = () => {
    return (
        <>
            <Route path={"/soknad"}>
                <SoknadDialog />
            </Route>
        </>
    );
};

export default App;
