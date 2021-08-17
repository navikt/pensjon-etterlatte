import { Route, Switch } from "react-router";
import SideIkkeFunnet from "./components/SideIkkeFunnet";
import DevLabs from "./components/dev/DevLabs";
import Banner from "./components/felles/Banner";
import UgyldigSoeker from "./components/UgyldigSoeker";
import Soeknad from "./components/soknad/Soeknad";
import Lenke from "nav-frontend-lenker";
import { ContentContainer } from "@navikt/ds-react";

const isDevEnv = true; //process.env.REACT_APP_ENVIRONMENT !== "production"; Må fikses når det skilles mellom prod/dev/qa

const App = () => {
    return (
        <>
            <Banner tekst={"Søknad om gjenlevendepensjon"} />
            <ContentContainer className={"soeknad"}>
                <Switch>
                    {/* TODO: Kun støtte i dev og Q, ikke prod. Krever litt endringer i appen. */}
                    {isDevEnv && <Route path={"/labs"} component={DevLabs} />}

                    <Route path={"/ugyldig-alder"} component={UgyldigSoeker} />

                    <Route exact path={["/", "/soknad/*"]} component={Soeknad} />

                    <Route component={SideIkkeFunnet} />
                </Switch>
            </ContentContainer>
            {/* Skal kun være synlig i dev/localhost */}
            {isDevEnv && <Lenke className={"labs-lenke"} href={"/labs"} />}
        </>
    );
};

export default App;
