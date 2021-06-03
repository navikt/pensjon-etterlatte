import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { sendSoeknad } from "../../../api";
import { useHistory } from "react-router-dom";
import { Normaltekst, Systemtittel } from "nav-frontend-typografi";
import React from "react";
import AlertStripe from "nav-frontend-alertstriper";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import { SkjemaGruppe } from "nav-frontend-skjema";
import OppsummeringSoeker from "./fragmenter/OppsummeringSoeker";
import OppsummeringSituasjon from "./fragmenter/OppsummeringSituasjon";
import OppsummeringAvdoed from "./fragmenter/OppsummeringAvdoed";
import SoknadSteg from "../../../typer/SoknadSteg";
import { useTranslation } from "react-i18next";

const Oppsummering: SoknadSteg = ({ forrige }) => {
    const history = useHistory();
    const { t } = useTranslation();
    const { state } = useSoknadContext();

    const {
        situasjon,
        opplysningerOmSoekeren,
        opplysningerOmDenAvdoede,
        // opplysningerOmBarn,
        // tidligereArbeidsforhold,
        // naavaerendeArbeidsforhold,
        // andreYtelser
    } = state;

    const send = () => {
        sendSoeknad(state)
            .then((r) => {
                console.log(r);

                history.push("/soknad/sendt");
            })
            .catch((error) => {
                // TODO: Håndtere feil. Redirect til feilside?
                console.error(error);


            });
    };

    return (
        <>
            <SkjemaGruppe>
                <Systemtittel className={"center"}>Oppsummering</Systemtittel>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Normaltekst>Les gjennom oppsummeringen av din søknad før du sender.</Normaltekst>
                <Normaltekst>Hvis du trenger å gjøre endringer, kan du gå tilbake og gjøre det. </Normaltekst>
            </SkjemaGruppe>

            <OppsummeringSituasjon state={situasjon!!} />

            <OppsummeringSoeker state={opplysningerOmSoekeren!!} />

            <OppsummeringAvdoed state={opplysningerOmDenAvdoede!!} />

            <br />
            <Ekspanderbartpanel tittel="Vis søknad JSON">
                <pre>{JSON.stringify(state, null, 2)}</pre>
            </Ekspanderbartpanel>
            <br />

            <AlertStripe type="info">Klikk send søknad hvis alt ser OK ut... osv</AlertStripe>
            <br />

            <SkjemaGruppe className={"navigasjon-rad"}>
                <Knapp htmlType={"button"} onClick={forrige}>
                    {t("knapp.tilbake")}
                </Knapp>

                <Hovedknapp htmlType={"button"} onClick={send}>
                    {t("knapp.sendSoeknad")}
                </Hovedknapp>
            </SkjemaGruppe>
        </>
    );
};

export default Oppsummering;
