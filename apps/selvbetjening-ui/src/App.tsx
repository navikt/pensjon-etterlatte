import React from "react";
import { Route, Switch } from "react-router";
import "./App.less";
import NotFound from "./NotFound";
import SoknadDialog from "./components/soknad/SoknadDialog";
import ContextProviders from "./context/ContextProviders";
import SoknadForside from "./components/soknad/SoknadForside";
import SoknadSendt from "./components/soknad/SoknadSendt";
import SoknadOppsummering from "./components/soknad/SoknadOppsummering";
import { useSoknadContext } from "./context/soknad/SoknadContext";
import { useHistory } from "react-router-dom";

const App = () => {
    const history = useHistory()

    const { state: { harSamtykket }} = useSoknadContext();

    if (!harSamtykket) {
        history.push("/")
    }

    return (
        <ContextProviders>
            <Switch>
                <Route exact path={"/"} component={SoknadForside} />

                <Route path={"/soknad/steg"} component={SoknadDialog} />
                <Route path={"/soknad/oppsummering"} component={SoknadOppsummering} />
                <Route path={"/soknad/sendt"} component={SoknadSendt} />

                <Route component={NotFound} />
            </Switch>
        </ContextProviders>
    );
};

export default App;
