import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { sendSoeknad } from "../../../api";
import { useHistory } from "react-router-dom";
import { Normaltekst, Systemtittel } from "nav-frontend-typografi";
import React, { memo, useState } from "react";
import { SkjemaGruppe } from "nav-frontend-skjema";
import SoknadSteg from "../../../typer/SoknadSteg";
import AlertStripe from "nav-frontend-alertstriper";
import Navigasjon from "../../felles/Navigasjon";
import ObjectTreeReader from "../../../utils/ObjectTreeReader";
import { IAvdoed, IBarn, ISoeker, ISoekerOgAvdoed } from "../../../typer/person";
import TekstGruppe from "./fragmenter/TekstGruppe";
import { v4 as uuid } from "uuid";
import { useTranslation } from "react-i18next";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import { StegPath } from "../../../context/steg/steg";
import { EditFilled } from "@navikt/ds-icons";
import Lenke from "nav-frontend-lenker";
import { ISituasjon } from "../../../typer/situasjon";

const Oppsummering: SoknadSteg = memo(({ forrige }) => {
    const { t, i18n } = useTranslation();
    const history = useHistory();
    const { state } = useSoknadContext();

    const [senderSoeknad, setSenderSoeknad] = useState(false);
    const [error, setError] = useState(false);

    const send = () => {
        setSenderSoeknad(true);

        sendSoeknad(state)
            .then((soknadId) => {
                history.push(`/soknad/sendt/${soknadId}`);
            })
            .catch((error) => {
                console.log(error)
                setSenderSoeknad(false);
                setError(true)
            });
    };

    const otr = new ObjectTreeReader(i18n);

    const omDeg = otr.traverse<ISoeker>(state.omDeg, "omDeg")
    const omDegOgAvdoed = otr.traverse<ISoekerOgAvdoed>(state.omDegOgAvdoed, "omDegOgAvdoed")
    const omDenAvdoede = otr.traverse<IAvdoed>(state.omDenAvdoede, "omDenAvdoede")
    const dinSituasjon = otr.traverse<ISituasjon>(state.dinSituasjon, "dinSituasjon")
    const opplysningerOmBarn = otr.traverse<IBarn[]>(state.opplysningerOmBarn, "omBarn")

    const ekspanderbartPanel = (tittel: string, tekster: any[], path: StegPath) => (
        <Ekspanderbartpanel tittel={tittel} className={"oppsummering"} apen={true}>
            {!tekster.length && (
                <SkjemaGruppe>
                    <Normaltekst>Ingen informasjon</Normaltekst>
                </SkjemaGruppe>
            )}

            {tekster.map(({ key, val }) => (
                <TekstGruppe key={uuid()} tittel={t(key)} innhold={val}/>
            ))}

            <Lenke href={`/soknad/steg/${path}`}>
                <EditFilled/>
                <span>Endre svar</span>
            </Lenke>
        </Ekspanderbartpanel>
    );

    return (
        <>
            <SkjemaGruppe>
                <Systemtittel className={"center"}>Oppsummering</Systemtittel>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Normaltekst>Les gjennom oppsummeringen av din søknad før du sender.</Normaltekst>
                <Normaltekst>Hvis du trenger å gjøre endringer, kan du gå tilbake og gjøre det. </Normaltekst>
            </SkjemaGruppe>

            {ekspanderbartPanel("Om deg", omDeg, StegPath.OmDeg)}

            {ekspanderbartPanel("Om deg og avdøde", omDegOgAvdoed, StegPath.OmDegOgAvdoed)}

            {ekspanderbartPanel("Om den avdøde", omDenAvdoede, StegPath.OmAvdoed)}

            {ekspanderbartPanel("Din situasjon", dinSituasjon, StegPath.DinSituasjon)}

            {ekspanderbartPanel("Om barn", opplysningerOmBarn, StegPath.OmBarn)}

            <br />

            {error && (
                <SkjemaGruppe>
                    <AlertStripe type={"feil"}>
                        En feil oppsto ved sending. Vent litt og prøv på nytt. Dersom feilen vedvarer kan du kontakte kundeservice.
                    </AlertStripe>
                </SkjemaGruppe>
            )}

            <Navigasjon
                forrige={forrige}
                send={send}
                disabled={senderSoeknad}
            />
        </>
    );
});

export default Oppsummering;
