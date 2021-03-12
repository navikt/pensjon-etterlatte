import React from "react";
import { Route, Switch } from "react-router";
import "./App.less";
import NotFound from "./NotFound";
import SoknadDialog from "./components/soknad/SoknadDialog";
import { StateProvider } from "./store";

const App = () => {
    return (
        <StateProvider>
            <Switch>
                <Route path={"/soknad"}>
                    <SoknadDialog />
                </Route>
                <Route>
                    <NotFound />
                </Route>
            </Switch>
        </StateProvider>
    );
};

export default App;
