import React from "react";
import { Route, Switch } from "react-router";
import "./App.less";
import NotFound from "./NotFound";
import SoknadDialog from "./components/soknad/SoknadDialog";
import ContextProviders from "./context/ContextProviders";
import SoknadForside from "./components/soknad/SoknadForside";
import SoknadSendt from "./components/soknad/SoknadSendt";
import DevLabs from "./components/dev/DevLabs";

const App = () => {
    return (
        <ContextProviders>
            <Switch>
                <Route exact path={"/"} component={SoknadForside} />

                {/* TODO: Kun støtte i dev og Q, ikke prod. Krever litt endringer i appen. */}
                <Route path={"/labs"} component={DevLabs} />

                <Route path={"/soknad/steg"} component={SoknadDialog} />
                <Route path={"/soknad/sendt/:id"} component={SoknadSendt} />

                <Route component={NotFound} />
            </Switch>
        </ContextProviders>
    );
};

export default App;
