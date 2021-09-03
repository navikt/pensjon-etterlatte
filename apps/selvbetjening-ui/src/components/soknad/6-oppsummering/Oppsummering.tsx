import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { sendSoeknad } from "../../../api";
import { useHistory } from "react-router-dom";
import React, { memo, useState } from "react";
import { SkjemaGruppe } from "nav-frontend-skjema";
import SoknadSteg from "../../../typer/SoknadSteg";
import { Accordion, Alert, BodyLong, Link, Title } from "@navikt/ds-react";
import Navigasjon from "../../felles/Navigasjon";
import ObjectTreeReader from "../../../utils/ObjectTreeReader";
import { ISoeker, ISoekerOgAvdoed } from "../../../typer/person";
import TekstGruppe from "./fragmenter/TekstGruppe";
import { v4 as uuid } from "uuid";
import { useTranslation } from "react-i18next";
import { StegPath } from "../../../context/steg/steg";
import { EditFilled } from "@navikt/ds-icons";
import { ISituasjon } from "../../../typer/situasjon";
import OppsummeringOmBarn from "./fragmenter/OppsummeringOmBarn";
import OppsummeringOmAvdoede from "./fragmenter/OppsummeringOmAvdoede";
import { useBrukerContext } from "../../../context/bruker/BrukerContext";

const Oppsummering: SoknadSteg = memo(({ forrige }) => {
    const history = useHistory();

    const { t, i18n } = useTranslation();
    const { state } = useSoknadContext();
    const { state: bruker } = useBrukerContext();

    const [senderSoeknad, setSenderSoeknad] = useState(false);
    const [error, setError] = useState(false);

    const send = () => {
        setSenderSoeknad(true);
        setError(false);

        sendSoeknad(state, bruker)
            .then(() => history.push(`/soknad/sendt`))
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
    const dinSituasjon = otr.traverse<ISituasjon>(state.dinSituasjon, "dinSituasjon");

    const ekspanderbartPanel = (tittel: string, tekster: any[], path: StegPath) => (
        <Accordion heading={tittel} className={"oppsummering"} open={true} id={path}>
            {!tekster.length && (
                <SkjemaGruppe>
                    <BodyLong>{t("felles.ingenInfo")}</BodyLong>
                </SkjemaGruppe>
            )}

            {tekster.map(({ key, val }) => (
                <TekstGruppe key={uuid()} tittel={t(getBaseKey(key))} innhold={t(val)} id={key}/>
            ))}

            <Link href={`/soknad/steg/${path}`} className={senderSoeknad ? "disabled" : ""}>
                <EditFilled />
                <span>{t("felles.endreSvar")}</span>
            </Link>
        </Accordion>
    );

    return (
        <>
            <SkjemaGruppe>
                <Title size={"m"} className={"center"}>{t("oppsummering.tittel")}</Title>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <BodyLong>{t("oppsummering.beskrivelse")}</BodyLong>
            </SkjemaGruppe>

            {ekspanderbartPanel(t("omDeg.tittel"), omDeg, StegPath.OmDeg)}

            {ekspanderbartPanel(t("omDegOgAvdoed.tittel"), omDegOgAvdoed, StegPath.OmDegOgAvdoed)}

            <OppsummeringOmAvdoede opplysningerOmAvdoede={state.omDenAvdoede} senderSoeknad={senderSoeknad} />

            {ekspanderbartPanel(t("dinSituasjon.tittel"), dinSituasjon, StegPath.DinSituasjon)}

            <OppsummeringOmBarn opplysningerOmBarn={state.opplysningerOmBarn} senderSoeknad={senderSoeknad} />

            <br />

            {error && (
                <SkjemaGruppe>
                    <Alert variant={"error"}>{t("oppsummering.feilVedSending")}</Alert>
                </SkjemaGruppe>
            )}

            <Navigasjon forrige={{ onClick: forrige }} send={{ onClick: send }} disabled={senderSoeknad} />
        </>
    );
});

export default Oppsummering;
