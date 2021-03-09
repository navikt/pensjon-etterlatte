import React from "react";
import { Route, Switch } from "react-router";
import "./App.less";
import SoknadDialog from "./soknad/SoknadDialog";

const App = () => {
    return (
        <>
            <Switch>
                <Route path={"/"}>
                    <h1>hello world</h1>
                </Route>
                <Route path={"/soknad"}>
                    <SoknadDialog />
                </Route>
            </Switch>
        </>
    );
};

export default App;
