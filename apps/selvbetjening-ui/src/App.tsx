import { Route, Switch } from "react-router";
import SideIkkeFunnet from "./components/SideIkkeFunnet";
import DevLabs from "./components/dev/DevLabs";
import Banner from "./components/felles/Banner";
import UgyldigSoeker from "./components/UgyldigSoeker";
import Soeknad from "./components/soknad/Soeknad";
import Lenke from "nav-frontend-lenker";

const App = () => {
    return (
        <>
            <Banner tekst={"Søknad om gjenlevendepensjon"}/>

            <div className={"soeknad"}>
                <Switch>
                    {/* TODO: Kun støtte i dev og Q, ikke prod. Krever litt endringer i appen. */}
                    <Route path={"/labs"} component={DevLabs} />

                    <Route path={"/ugyldig-alder"} component={UgyldigSoeker} />

                    <Route exact path={["/", "/soknad/*"]} component={Soeknad} />

                    <Route component={SideIkkeFunnet} />
                </Switch>
            </div>

            {/* TODO: Kun være synlig i dev/localhost */}
            <Lenke className={"labs-lenke"} href={"/labs"} />
        </>
    );
};

export default App;
