import { Redirect, Route, Switch } from "react-router";
import SideIkkeFunnet from "./components/SideIkkeFunnet";
import Banner from "./components/felles/Banner";
import UgyldigSoeker from "./components/UgyldigSoeker";
import Soeknad from "./components/soknad/Soeknad";
import { ContentContainer } from "@navikt/ds-react";
import useInnloggetBruker from "./hooks/useInnloggetBruker";
import { useAmplitude } from "./utils/amplitude";

const App = () => {
    useInnloggetBruker();
    useAmplitude();

    return (
        <>
            <Banner tekst={"Søknad om gjenlevendepensjon"} />

            <ContentContainer className={"soeknad"} role="main">
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
