import React from "react";
import { Route, Switch } from "react-router";
import "./App.less";
import NotFound from "./NotFound";
import SoknadDialog from "./components/soknad/SoknadDialog";
import Labs from "./components/Labs";
import ContextProviders from "./context/ContextProviders";
import SoknadForside from "./components/soknad/SoknadForside";
import SoknadSendt from "./components/soknad/SoknadSendt";

const App = () => {
    return (
        <>
            <ContextProviders>
                <Switch>
                    <Route path={"/labs"}>
                        <Labs />
                    </Route>
                    <Route exact path={"/"}>
                        <SoknadForside />
                    </Route>
                    <Route path={"/soknad"}>
                        <SoknadDialog />
                    </Route>
                    <Route path={"/sendt"}>
                        <SoknadSendt />
                    </Route>
                    <Route>
                        <NotFound />
                    </Route>
                </Switch>
            </ContextProviders>
        </>
    );
};

export default App;
