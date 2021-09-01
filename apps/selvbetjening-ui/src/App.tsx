import { Redirect, Route, Switch } from "react-router";
import SideIkkeFunnet from "./components/SideIkkeFunnet";
import Banner from "./components/felles/Banner";
import UgyldigSoeker from "./components/UgyldigSoeker";
import Soeknad from "./components/soknad/Soeknad";
import { ContentContainer } from "@navikt/ds-react";
import { useEffect, useState } from "react";
import { hentInnloggetPerson } from "./api";
import { ActionTypes as BrukerActionTypes, IBruker } from "./context/bruker/bruker";
import { hentAlder } from "./utils/dato";
import { gyldigAlder } from "./utils/alder";
import { useBrukerContext } from "./context/bruker/BrukerContext";
import { useHistory } from "react-router-dom";
import Spinner from "./components/felles/Spinner";

const App = () => {
    const history = useHistory();

    const { dispatch } = useBrukerContext();
    const [lasterBruker, settLasterBruker] = useState(true);

    useEffect(() => {
        hentInnloggetPerson()
            .then((person: IBruker) => {
                const alder = hentAlder(person.foedselsdato!!);
                const kanSoeke = gyldigAlder(alder)

                dispatch({
                    type: BrukerActionTypes.HENT_INNLOGGET_BRUKER,
                    payload: { ...person, alder, kanSoeke }
                });

                if (!kanSoeke) {
                    settLasterBruker(false)
                    history.push("/ugyldig-alder")
                }
            })
            .catch((e) => console.error(e))
            .finally(() => settLasterBruker(false));
    }, []);

    return (
        <>
            <Banner tekst={"Søknad om gjenlevendepensjon"} />

            <Spinner visible={lasterBruker} label={"Henter informasjon ..."}/>

            <ContentContainer className={"soeknad"}>
                <Switch>
                    <Redirect from={"/labs"} to={"/soknad/admin"} />

                    <Route path={"/ugyldig-alder"} component={UgyldigSoeker} />

                    <Route exact path={["/", "/soknad/*"]} component={Soeknad} />

                    <Route component={SideIkkeFunnet} />
                </Switch>
            </ContentContainer>
        </>
    );
};

export default App;
