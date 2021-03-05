import React, { FC } from "react";
import { Route, Switch } from "react-router";
import "./App.less";
import SoknadDialog from "./soknad/SoknadDialog";

const App: FC = () => {
    return (
        <>
            <Switch>
                <Route path={"/soknad"}>
                    <SoknadDialog />
                </Route>
            </Switch>
        </>
    );
};

export default App;
