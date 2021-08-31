import { Redirect, Route, Switch } from "react-router";
import SideIkkeFunnet from "./components/SideIkkeFunnet";
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
                    <Redirect from={"/labs"} to={"/soknad/admin"} />

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
