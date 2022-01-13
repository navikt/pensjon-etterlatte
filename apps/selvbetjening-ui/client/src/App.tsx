import { useState } from "react";
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
import Nedteller from "./components/felles/Nedteller";
import UtloggingsAlert from "./components/felles/UtloggingsAlert";

const App = () => {
    useInnloggetBruker();
    const soknadContext = useSoknadContext();
    useAmplitude();
    const { t } = useTranslation();

    const [open, setIsOpen] = useState<boolean>(true);

    const props = { minutter: 5, visTimer: false };

    return (
        <>
            <Banner tekst={t("banner.tittel")} />

            <ContentContainer className={"soeknad"} role="main">
                <Switch>
                    <Redirect from={"/labs"} to={"/skjema/admin"} />

                    <Route path={"/ugyldig-alder"} component={UgyldigSoeker} />

                    <Route exact path={["/", "/skjema/*"]} component={Soeknad} />

                    <Route component={SideIkkeFunnet} />
                </Switch>
                {soknadContext?.state?.error && (
                    <div className="global-alert-wrap">
                        <Alert variant="error">{soknadContext?.state?.error}</Alert>
                    </div>
                )}
                {open && (
                    <div className="utlogging-alert-wrap">
                        <UtloggingsAlert onClose={() => setIsOpen(false)}>
                            {`${t("brukerLoggesUt.info1")} `}
                            <strong>
                                <Nedteller {...props} />
                            </strong>
                            {` ${t("brukerLoggesUt.tid")}.
                            ${t("brukerLoggesUt.info2")}`}
                        </UtloggingsAlert>
                    </div>
                )}
            </ContentContainer>
        </>
    );
};

export default App;
