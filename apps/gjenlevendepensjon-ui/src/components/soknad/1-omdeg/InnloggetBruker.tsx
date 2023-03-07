import {Alert, BodyShort, Cell, Grid, Label, HelpText} from "@navikt/ds-react";
import { useTranslation } from "react-i18next";
import { useBrukerContext } from "../../../context/bruker/BrukerContext";
import { SkjemaGruppe } from "../../felles/SkjemaGruppe";
import { isEmpty } from "lodash";
import React, { memo } from "react";
import { fullAdresse } from "../../../utils/adresse";
import styled from "styled-components";

const InnloggetBrukerAlert = styled(Alert)`
  background: none;
  border: none;
  padding: 0;
`

const HjelpeTekstLabel = styled.div`
    .navds-label {
        display: flex;
    }
`

const InnloggetBruker = memo(() => {
    const { t } = useTranslation();

    const { state } = useBrukerContext();

    if (isEmpty(state)) return null;

    return (
        <SkjemaGruppe>
            <Grid>
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
                        <HjelpeTekstLabel>
                            <Label as={'span'}>
                                {t("felles.telefonnummer")}&nbsp;
                                <HelpText>{t("felles.telefonnummerHjelpetekst")}</HelpText>
                            </Label>
                            <BodyShort spacing>{state.telefonnummer}</BodyShort>
                        </HjelpeTekstLabel>
                    )}
                </Cell>
            </Grid>

            {!state.adressebeskyttelse && state.adresse && (
                    <InnloggetBrukerAlert variant={"warning"}>
                        <a href={t("omDeg.advarsel.href")} target="_blank" rel="noreferrer">
                            {t("omDeg.advarsel")}
                        </a>
                    </InnloggetBrukerAlert>
            )}
        </SkjemaGruppe>
    );
});

export default InnloggetBruker;
