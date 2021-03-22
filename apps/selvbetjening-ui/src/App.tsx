import React from "react";
import { Route, Switch } from "react-router";
import "./App.less";
import NotFound from "./NotFound";
import SoknadDialog from "./components/soknad/SoknadDialog";
import Labs from "./components/Labs";
import ContextProviders from "./context/ContextProviders";
import { EnforceLoginLoader } from "@navikt/nav-dekoratoren-moduler";

const App = () => {
    return (
        <ContextProviders>
            <Switch>
                <Route path={"/labs"}>
                    <Labs />
                </Route>
                <Route path={"/soknad"}>
                    <EnforceLoginLoader>
                        <SoknadDialog />
                    </EnforceLoginLoader>
                </Route>
                <Route>
                    <NotFound />
                </Route>
            </Switch>
        </ContextProviders>
    );
};

export default App;
