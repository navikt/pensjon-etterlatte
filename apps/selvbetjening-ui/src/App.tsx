import React, { useEffect } from "react";
import { Route, Switch } from "react-router";
import "./App.less";
import SideIkkeFunnet from "./components/SideIkkeFunnet";
import SoknadDialog from "./components/soknad/SoknadDialog";
import SoknadForside from "./components/soknad/SoknadForside";
import SoknadKvittering from "./components/soknad/SoknadKvittering";
import DevLabs from "./components/dev/DevLabs";
import { hentInnloggetPerson } from "./api";
import { ActionTypes, IBruker } from "./context/bruker/bruker";
import { useBrukerContext } from "./context/bruker/BrukerContext";
import Banner from "./components/felles/Banner";

const App = () => {
    const {
        state: brukerState,
        dispatch: brukerDispatch
    } = useBrukerContext();

    useEffect(() => {
        if (!brukerState?.foedselsnummer) {
            hentInnloggetPerson()
                .then((person: IBruker) => {
                    brukerDispatch({ type: ActionTypes.HENT_INNLOGGET_BRUKER, payload: person });
                })
                .catch(() => {
                    if (process.env.NODE_ENV === "development") {
                        brukerDispatch({ type: ActionTypes.INIT_TEST_BRUKER });
                    }
                });
        }
    }, [brukerState?.foedselsnummer, brukerDispatch]);

    return (
        <>
            <Banner tekst={"Søknad om gjenlevendepensjon"}/>

            <div className={"soeknad"}>
                <Switch>
                    <Route exact path={"/"} component={SoknadForside} />

                    {/* TODO: Kun støtte i dev og Q, ikke prod. Krever litt endringer i appen. */}
                    <Route path={"/labs"} component={DevLabs} />

                    <Route path={"/soknad/steg"} component={SoknadDialog} />
                    <Route path={"/soknad/sendt/:id"} component={SoknadKvittering} />

                    <Route component={SideIkkeFunnet} />
                </Switch>
            </div>
        </>
    );
};

export default App;
