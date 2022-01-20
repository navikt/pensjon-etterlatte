import { Alert, BodyShort, Label } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";
import { useBrukerContext } from "../../../context/bruker/BrukerContext";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { Cell, Grid } from "@navikt/ds-react";
import { isEmpty } from "lodash";
import { memo } from "react";
import { fullAdresse } from "../../../utils/adresse";

const InnloggetBruker = memo(() => {
    const { t } = useTranslation();

    const { state } = useBrukerContext();

    if (isEmpty(state)) return null;

    return (
        <SkjemaGruppe>
            <br />
            <Alert variant={"warning"}>{t("omDeg.advarsel")}</Alert>
            <div className="mute" style={{ margin: "2em 0" }}>
                {t("omDeg.valgfritt")}
            </div>
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
                        <BodyShort spacing>{state.sivilstatus}</BodyShort>
                    </div>

                    <div>
                        <Label>{t("felles.statsborgerskap")}</Label>
                        <BodyShort spacing>{state.statsborgerskap}</BodyShort>
                    </div>
                </Cell>
            </Grid>
        </SkjemaGruppe>
    );
});

export default InnloggetBruker;
