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
import UtloeptSession from './components/felles/UtloeptSession'
import SystemUtilgjengelig from "./components/SystemUtilgjengelig";
import styled from "styled-components";

const SoeknadWrapper = styled(ContentContainer)`
    div,
    label,
    legend,
    span,
    p {
        font-size: 16px;
    }

    .navds-step-indicator {
        justify-content: center;
    }

    @media screen and (max-width: 650px) {
        padding: 1rem;
        margin: 0 auto;
        max-width: 100%;
        white-space: pre-line;
    }

    @media screen and (min-width: 650px) {
        padding: 2rem;
        margin: 0 auto;
        max-width: 650px !important;
        white-space: pre-line;
    }
`

const GlobalAlertWrap = styled.div`
position: fixed;
  bottom: 2em;
  left: 1em;
  right: 1em;
  margin: 0 auto;
  max-width: 600px;
  width: 100%;
`

const App = () => {
    useInnloggetBruker();
    const soknadContext = useSoknadContext();
    useAmplitude();
    const { t } = useTranslation();

    return (
        <>
            <Banner tekst={t("banner.tittel")} />

            <SoeknadWrapper role="main">
                <Switch>
                    <Redirect from={"/labs"} to={"/skjema/admin"} />

                    <Route path={"/ugyldig-alder"} component={UgyldigSoeker} />

                    <Route path={"/system-utilgjengelig"} component={SystemUtilgjengelig} />

                    <Route exact path={["/", "/skjema/*"]} component={Soeknad} />

                    <Route component={SideIkkeFunnet} />
                </Switch>
                {soknadContext?.state?.error && (
                    <GlobalAlertWrap>
                        <Alert variant="error">{soknadContext?.state?.error}</Alert>
                    </GlobalAlertWrap>
                )}
                <UtloeptSession />
            </SoeknadWrapper>
        </>
    );
};

export default App;
