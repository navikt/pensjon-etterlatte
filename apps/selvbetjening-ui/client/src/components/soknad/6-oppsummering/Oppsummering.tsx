import { Alert, BodyLong, Heading, Link } from "@navikt/ds-react";
import { isEmpty } from "lodash";
import { SkjemaGruppe } from "nav-frontend-skjema";
import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { sendSoeknad } from "../../../api/api";
import { SoeknadRequest, SoeknadType } from "../../../api/dto/InnsendtSoeknad";
import { mapTilBarnepensjonSoeknadListe, mapTilGjenlevendepensjonSoeknad } from "../../../api/mapper/soeknadMapper";
import { useBrukerContext } from "../../../context/bruker/BrukerContext";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import SoknadSteg from "../../../typer/SoknadSteg";
import { LogEvents, useAmplitude } from "../../../utils/amplitude";
import SoeknadMapper from "../../../utils/SoeknadMapper";
import Navigasjon from "../../felles/Navigasjon";
import OppsummeringInnhold from "./OppsummeringInnhold";

const Oppsummering: SoknadSteg = memo(({ forrige }) => {
    const history = useHistory();
    const [soeknadOppsummering, setOppsummering] = useState<any>([]);
    const { t } = useTranslation();

    const { state: soeknad } = useSoknadContext();
    const { state: bruker } = useBrukerContext();
    const { logEvent } = useAmplitude();

    const [senderSoeknad, setSenderSoeknad] = useState(false);
    const [error, setError] = useState(false);

    const mapper = new SoeknadMapper(t);

    useEffect(() => {
        (async () => {
            if (isEmpty(soeknad) || isEmpty(bruker)) {
                setOppsummering([]);
            } else {
                const soeknadOppsummering = mapper.lagOppsummering(soeknad, bruker);
                setOppsummering(soeknadOppsummering);
            }
        })();
    }, [soeknad, bruker]);

    const send = () => {
        setSenderSoeknad(true);
        setError(false);

        const gjenlevendepensjon = mapTilGjenlevendepensjonSoeknad(t, soeknad, bruker);
        const barnepensjonSoeknader = mapTilBarnepensjonSoeknadListe(t, soeknad, bruker);

        const soeknadBody: SoeknadRequest = {
            soeknader: [gjenlevendepensjon, ...barnepensjonSoeknader],
        };

        sendSoeknad(soeknadBody)
            .then(() => {
                logEvent(LogEvents.SEND_SOKNAD, { type: SoeknadType.GJENLEVENDEPENSJON });

                barnepensjonSoeknader.forEach(() => {
                    logEvent(LogEvents.SEND_SOKNAD, { type: SoeknadType.BARNEPENSJON });
                });

                history.push(`/skjema/sendt`);
            })
            .catch((error) => {
                console.log(error);
                setSenderSoeknad(false);
                setError(true);
            });
    };

    return (
        <>
            <SkjemaGruppe>
                <Heading size={"medium"} className={"center"}>
                    {t("oppsummering.tittel")}
                </Heading>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <BodyLong>{t("oppsummering.beskrivelse")}</BodyLong>
            </SkjemaGruppe>

            {!isEmpty(soeknadOppsummering) && (
                <OppsummeringInnhold soeknadOppsummering={soeknadOppsummering} senderSoeknad={senderSoeknad} />
            )}

            <br />

            {error && (
                <SkjemaGruppe>
                    <Alert variant={"error"}>
                        {t("oppsummering.feilVedSending")}
                        <Link href={t("oppsummering.feilVedSending.href")}>
                            {t("oppsummering.feilVedSending.tittel")}
                        </Link>
                    </Alert>
                </SkjemaGruppe>
            )}

            <Navigasjon forrige={{ onClick: forrige }} send={{ onClick: send }} disabled={senderSoeknad} />
        </>
    );
});

export default Oppsummering;
