import React from "react";
import { Route, Switch } from "react-router";
import "./App.less";
import NotFound from "./NotFound";
import SoknadDialog from "./soknad/SoknadDialog";

const App = () => {
    return (
        <>
            <Switch>
                <Route path={"/soknad"}>
                    <SoknadDialog />
                </Route>
                <Route>
                    <NotFound />
                </Route>
            </Switch>
        </>
    );
};

export default App;
