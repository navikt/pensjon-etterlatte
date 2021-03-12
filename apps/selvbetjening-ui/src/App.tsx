import React from "react";
import { Route, Switch } from "react-router";
import "./App.less";
import NotFound from "./NotFound";
import SoknadDialog from "./components/soknad/SoknadDialog";
import ContextProviders from "./context/ContextProviders";

const App = () => {
    return (
        <ContextProviders>
            <Switch>
                <Route path={"/soknad"}>
                    <SoknadDialog />
                </Route>
                <Route>
                    <NotFound />
                </Route>
            </Switch>
        </ContextProviders>
    );
};

export default App;
