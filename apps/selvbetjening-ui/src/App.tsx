import { Redirect, Route, Switch } from "react-router";
import SideIkkeFunnet from "./components/SideIkkeFunnet";
import Banner from "./components/felles/Banner";
import UgyldigSoeker from "./components/UgyldigSoeker";
import Soeknad from "./components/soknad/Soeknad";
import { ContentContainer, Alert } from "@navikt/ds-react";
import useInnloggetBruker from "./hooks/useInnloggetBruker";
import { useAmplitude } from "./utils/amplitude";
import { useSoknadContext } from "./context/soknad/SoknadContext";

const App = () => {
    useInnloggetBruker();
    const soknadContext = useSoknadContext();
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
                {soknadContext?.state?.error && <Alert variant="error">{soknadContext?.state?.error}</Alert>}
            </ContentContainer>
        </>
    );
};

export default App;
