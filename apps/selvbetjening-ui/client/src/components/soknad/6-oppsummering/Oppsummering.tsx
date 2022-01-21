import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { useHistory } from "react-router-dom";
import React, { memo, useEffect, useState } from "react";
import { SkjemaGruppe } from "nav-frontend-skjema";
import SoknadSteg from "../../../typer/SoknadSteg";
import { Alert, BodyLong, Heading } from "@navikt/ds-react";
import Navigasjon from "../../felles/Navigasjon";
import { useTranslation } from "react-i18next";
import { useBrukerContext } from "../../../context/bruker/BrukerContext";
import { hentOppsummering, sendSoeknad } from "../../../api/api";
import OppsummeringInnhold from "./OppsummeringInnhold";
import { isEmpty } from "lodash";
import { LogEvents, useAmplitude } from "../../../utils/amplitude";
import {
    mapTilBarnepensjonSoeknadListe,
    mapTilGjenlevendepensjonSoeknad
} from "../../../api/mapper/soeknadMapper";
import { SoeknadRequest, SoeknadType } from "../../../api/dto/InnsendtSoeknad";

const Oppsummering: SoknadSteg = memo(({ forrige }) => {
    const history = useHistory();
    const [soeknadOppsummering, setOppsummering] = useState<any>([]);
    const { t, i18n } = useTranslation();

    const { state: soeknad } = useSoknadContext();
    const { state: bruker } = useBrukerContext();
    const { logEvent } = useAmplitude();

    const [senderSoeknad, setSenderSoeknad] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        (async () => {
            if (isEmpty(soeknad) || isEmpty(bruker)) setOppsummering([]);
            const soeknadOppsummering: any = await hentOppsummering({soeknad, bruker, locale: i18n.language});
            setOppsummering(soeknadOppsummering);
        })()
    }, [soeknad, bruker])

    const send = () => {
        setSenderSoeknad(true);
        setError(false);

        const gjenlevendepensjon = mapTilGjenlevendepensjonSoeknad(t, soeknad, bruker);
        const barnepensjonSoeknader = mapTilBarnepensjonSoeknadListe(t, soeknad, bruker);

        const soeknadBody: SoeknadRequest = {
            soeknader: [gjenlevendepensjon, ...barnepensjonSoeknader]
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

            <OppsummeringInnhold
                soeknadOppsummering={soeknadOppsummering}
                senderSoeknad={senderSoeknad}
            />

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
