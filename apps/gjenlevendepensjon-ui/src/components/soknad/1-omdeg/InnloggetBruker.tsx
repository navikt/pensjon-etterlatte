import {Alert, BodyShort, Cell, Grid, Label} from "@navikt/ds-react";
import { useTranslation } from "react-i18next";
import { useBrukerContext } from "../../../context/bruker/BrukerContext";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { isEmpty } from "lodash";
import React, { memo } from "react";
import { fullAdresse } from "../../../utils/adresse";
import Hjelpetekst from "../../felles/Hjelpetekst";

const InnloggetBruker = memo(() => {
    const { t } = useTranslation();

    const { state } = useBrukerContext();

    if (isEmpty(state)) return null;

    return (
        <SkjemaGruppe>
            <Grid className={"opplysninger"}>
                <Cell xs={6}>
                    <div>
                        <Label>{t("felles.navn")}</Label>
                        <BodyShort spacing>
                            {state.fornavn} {state.etternavn}
                        </BodyShort>
                    </div>

                    <div>
                        <Label>{t("felles.fnrDnr")}</Label>
                        <BodyShort spacing>{state.foedselsnummer}</BodyShort>
                    </div>

                    {state.adresse && !state.adressebeskyttelse && (
                        <div>
                            <Label>{t("felles.adresse")}</Label>
                            <BodyShort spacing>
                                {fullAdresse(state)}
                            </BodyShort>
                        </div>
                    )}
                </Cell>

                <Cell xs={6}>
                    <div>
                        <Label>{t("felles.sivilstatus")}</Label>
                        <BodyShort spacing>{t(`pdl.sivilstatus.${state.sivilstatus}`)}</BodyShort>
                    </div>

                    <div>
                        <Label>{t("felles.statsborgerskap")}</Label>
                        <BodyShort spacing>{state.statsborgerskap}</BodyShort>
                    </div>

                    {state.telefonnummer && (
                        <div>
                            <Label>{t("felles.telefonnummer")}&nbsp;
                                <Hjelpetekst>{t("felles.telefonnummerHjelpetekst")}</Hjelpetekst></Label>
                            <BodyShort spacing>{state.telefonnummer}</BodyShort>
                        </div>
                    )}
                </Cell>
            </Grid>

            {!state.adressebeskyttelse && state.adresse && (
                    <Alert variant={"warning"} className={"navds-alert--inline"}>
                        <a href={t("omDeg.advarsel.href")} target="_blank" rel="noreferrer">
                            {t("omDeg.advarsel")}
                        </a>
                    </Alert>
            )}
        </SkjemaGruppe>
    );
});

export default InnloggetBruker;
