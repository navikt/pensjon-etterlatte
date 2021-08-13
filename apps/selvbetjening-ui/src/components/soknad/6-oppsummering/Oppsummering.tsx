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
import { IAvdoed, IOmBarn, ISoeker, ISoekerOgAvdoed } from "../../../typer/person";
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
        setError(false);

        sendSoeknad(state)
            .then((soknadId) => {
                history.push(`/soknad/sendt/${soknadId}`);
            })
            .catch((error) => {
                console.log(error);
                setSenderSoeknad(false);
                setError(true);
            });
    };

    const getBaseKey = (string: string) => {
        return string.replace(/(.\d+)/g, "");
    };

    const otr = new ObjectTreeReader(i18n);

    const omDeg = otr.traverse<ISoeker>(state.omDeg, "omDeg");
    const omDegOgAvdoed = otr.traverse<ISoekerOgAvdoed>(state.omDegOgAvdoed, "omDegOgAvdoed");
    const omDenAvdoede = otr.traverse<IAvdoed>(state.omDenAvdoede, "omDenAvdoede");
    const dinSituasjon = otr.traverse<ISituasjon>(state.dinSituasjon, "dinSituasjon");

    // TODO: Fikse måten barn og tidligere arbeidsforhold vises.
    const opplysningerOmBarn = otr.traverse<IOmBarn>(state.opplysningerOmBarn, "omBarn");

    const ekspanderbartPanel = (tittel: string, tekster: any[], path: StegPath) => (
        <Ekspanderbartpanel tittel={tittel} className={"oppsummering"} apen={true}>
            {!tekster.length && (
                <SkjemaGruppe>
                    <Normaltekst>{t("felles.ingenInfo")}</Normaltekst>
                </SkjemaGruppe>
            )}

            {tekster.map(({ key, val }) => (
                <TekstGruppe key={uuid()} tittel={t(getBaseKey(key))} innhold={t(val)} />
            ))}

            <Lenke href={`/soknad/steg/${path}`} className={senderSoeknad ? "disabled" : ""}>
                <EditFilled />
                <span>{t("felles.endreSvar")}</span>
            </Lenke>
        </Ekspanderbartpanel>
    );

    return (
        <>
            <SkjemaGruppe>
                <Systemtittel className={"center"}>{t("oppsummering.tittel")}</Systemtittel>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Normaltekst>{t("oppsummering.beskrivelse")}</Normaltekst>
            </SkjemaGruppe>

            {ekspanderbartPanel(t("omDeg.tittel"), omDeg, StegPath.OmDeg)}

            {ekspanderbartPanel(t("omDegOgAvdoed.tittel"), omDegOgAvdoed, StegPath.OmDegOgAvdoed)}

            {ekspanderbartPanel(t("omDenAvdoede.tittel"), omDenAvdoede, StegPath.OmAvdoed)}

            {ekspanderbartPanel(t("dinSituasjon.tittel"), dinSituasjon, StegPath.DinSituasjon)}

            {ekspanderbartPanel(t("omBarn.tittel"), opplysningerOmBarn, StegPath.OmBarn)}

            <br />

            {error && (
                <SkjemaGruppe>
                    <AlertStripe type={"feil"}>{t("oppsummering.feilVedSending")}</AlertStripe>
                </SkjemaGruppe>
            )}

            <Navigasjon forrige={{ onClick: forrige }} send={{ onClick: send }} disabled={senderSoeknad} />
        </>
    );
});

export default Oppsummering;
