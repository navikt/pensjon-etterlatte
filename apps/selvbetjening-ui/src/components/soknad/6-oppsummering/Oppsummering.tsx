import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { useHistory } from "react-router-dom";
import React, { memo, useMemo, useState } from "react";
import { SkjemaGruppe } from "nav-frontend-skjema";
import SoknadSteg from "../../../typer/SoknadSteg";
import { Alert, BodyLong, Heading } from "@navikt/ds-react";
import Navigasjon from "../../felles/Navigasjon";
import { useTranslation } from "react-i18next";
import { useBrukerContext } from "../../../context/bruker/BrukerContext";
import { Gruppe } from "../../../utils/ObjectTreeReader";
import SoeknadMapper from "../../../utils/SoeknadMapper";
import { sendSoeknad } from "../../../api/api";
import OppsummeringInnhold from "./OppsummeringInnhold";
import { isEmpty } from "lodash";
import { useAmplitude } from "../../../utils/amplitude";

const Oppsummering: SoknadSteg = memo(({ forrige }) => {
    const history = useHistory();

    const { t, i18n } = useTranslation();

    const { state: soeknad } = useSoknadContext();
    const { state: bruker } = useBrukerContext();
    const { logData } = useAmplitude();

    const [senderSoeknad, setSenderSoeknad] = useState(false);
    const [error, setError] = useState(false);

    const mapper = new SoeknadMapper(t, i18n);
    const soeknadOppsummering: Gruppe[] = useMemo(() => {
        if (isEmpty(soeknad) || isEmpty(bruker)) return [];

        return mapper.lagOppsummering(soeknad, bruker)
    }, [soeknad, bruker]);

    const send = () => {
        setSenderSoeknad(true);
        setError(false);
        const soeknadBody = { oppsummering: soeknadOppsummering }
        sendSoeknad(soeknadBody)
            .then(() => {
                logData(soeknadOppsummering)
                history.push(`/soknad/sendt`);
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
