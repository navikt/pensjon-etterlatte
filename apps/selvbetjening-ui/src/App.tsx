import { Redirect, Route, Switch } from "react-router";
import "./App.less";
import SideIkkeFunnet from "./components/SideIkkeFunnet";
import DevLabs from "./components/dev/DevLabs";
import Banner from "./components/felles/Banner";
import UgyldigSoeker from "./components/UgyldigSoeker";
import Soeknad from "./components/soknad/Soeknad";

const App = () => {
    return (
        <>
            <Banner tekst={"Søknad om gjenlevendepensjon"}/>

            <div className={"soeknad"}>
                <Switch>
                    <Redirect exact from={"/"} to={"/soknad"} />

                    <Route path={"/soknad"} component={Soeknad} />

                    {/* TODO: Kun støtte i dev og Q, ikke prod. Krever litt endringer i appen. */}
                    <Route path={"/labs"} component={DevLabs} />

                    <Route path={"/ugyldig-alder"} component={UgyldigSoeker} />

                    <Route component={SideIkkeFunnet} />
                </Switch>
            </div>
        </>
    );
};

export default App;
