import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { sendSoeknad } from "../../../api";
import { useHistory } from "react-router-dom";
import { Ingress, Normaltekst, Systemtittel } from "nav-frontend-typografi";
import React, { useState } from "react";
import { Fareknapp, Flatknapp, Hovedknapp, Knapp } from "nav-frontend-knapper";
import { SkjemaGruppe } from "nav-frontend-skjema";
import OppsummeringSoeker from "./fragmenter/OppsummeringSoeker";
import OppsummeringSituasjon from "./fragmenter/OppsummeringSituasjon";
import OppsummeringAvdoed from "./fragmenter/OppsummeringAvdoed";
import SoknadSteg from "../../../typer/SoknadSteg";
import { useTranslation } from "react-i18next";
import OppsummeringBarn from "./fragmenter/OppsummeringBarn";
import OppsummeringTidlArbeid from "./fragmenter/OppsummeringTidlArbeid";
import OppsummeringArbeidsforhold from "./fragmenter/OppsummeringArbeidsforhold";
import OppsummeringAndreYtelser from "./fragmenter/OppsummeringAndreYtelser";
import { default as Modal } from "nav-frontend-modal";
import { ActionTypes } from "../../../context/soknad/soknad";

const Oppsummering: SoknadSteg = ({ forrige }) => {
    const history = useHistory();
    const { t } = useTranslation();
    const { state, dispatch } = useSoknadContext();

    const {
        situasjon,
        opplysningerOmSoekeren,
        opplysningerOmDenAvdoede,
        opplysningerOmBarn,
        tidligereArbeidsforhold,
        naavaerendeArbeidsforhold,
        andreYtelser
    } = state;

    const [isOpen, setIsOpen] = useState<boolean>(false);

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

    const avbrytSoeknad = () => {
        dispatch({ type: ActionTypes.TILBAKESTILL })

        window.location.href = "https://www.nav.no"
    }

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

            <OppsummeringBarn state={opplysningerOmBarn} />

            <OppsummeringTidlArbeid state={tidligereArbeidsforhold} />

            <OppsummeringArbeidsforhold state={naavaerendeArbeidsforhold!!} />

            <OppsummeringAndreYtelser state={andreYtelser!!} />

            <br />

            <Modal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                closeButton={true}
                contentLabel={"aasdfsdf"}
            >
                <SkjemaGruppe>
                    <Ingress>
                        Er du helt sikker på at du vil avbryte søknaden?
                    </Ingress>
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <Hovedknapp htmlType={"button"} onClick={() => setIsOpen(false)}>
                        Nei, jeg vil fortsette søknaden
                    </Hovedknapp>
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <Fareknapp htmlType={"button"} onClick={avbrytSoeknad}>
                        Ja, avbryt søknaden
                    </Fareknapp>
                </SkjemaGruppe>
            </Modal>

            <SkjemaGruppe className={"navigasjon-rad"}>
                <Knapp htmlType={"button"} onClick={forrige}>
                    {t("knapp.tilbake")}
                </Knapp>

                <Hovedknapp htmlType={"button"} onClick={send}>
                    {t("knapp.sendSoeknad")}
                </Hovedknapp>
            </SkjemaGruppe>

            <SkjemaGruppe className={"navigasjon-rad"}>
                <Flatknapp htmlType={"button"} onClick={() => setIsOpen(true)}>
                    Avbryt
                </Flatknapp>
            </SkjemaGruppe>
        </>
    );
};

export default Oppsummering;
