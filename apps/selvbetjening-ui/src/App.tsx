import { Redirect, Route, Switch } from "react-router";
import SideIkkeFunnet from "./components/SideIkkeFunnet";
import Banner from "./components/felles/Banner";
import UgyldigSoeker from "./components/UgyldigSoeker";
import Soeknad from "./components/soknad/Soeknad";
import { ContentContainer, Alert } from "@navikt/ds-react";
import useInnloggetBruker from "./hooks/useInnloggetBruker";
import { useAmplitude } from "./utils/amplitude";
import { useSoknadContext } from "./context/soknad/SoknadContext";
import { useTranslation } from "react-i18next";

const App = () => {
    useInnloggetBruker();
    const soknadContext = useSoknadContext();
    useAmplitude();
    const { t } = useTranslation();

    return (
        <>
            <Banner tekst={t("banner.tittel")} />

            <ContentContainer className={"soeknad"} role="main">
                <Switch>
                    <Redirect from={"/labs"} to={"/soknad/admin"} />

                    <Route path={"/ugyldig-alder"} component={UgyldigSoeker} />

                    <Route exact path={["/", "/soknad/*"]} component={Soeknad} />

                    <Route component={SideIkkeFunnet} />
                </Switch>
                {soknadContext?.state?.error && (
                    <div className="global-alert-wrap">
                        <Alert variant="error">{soknadContext?.state?.error}</Alert>
                    </div>
                )}
            </ContentContainer>
        </>
    );
};

export default App;
