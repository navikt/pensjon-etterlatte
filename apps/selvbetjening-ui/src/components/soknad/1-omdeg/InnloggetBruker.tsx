import { Alert, BodyShort, Label } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";
import { useBrukerContext } from "../../../context/bruker/BrukerContext";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { Cell, Grid } from "@navikt/ds-react";
import { isEmpty } from "lodash";
import { memo } from "react";

const InnloggetBruker = memo(() => {
    const { t } = useTranslation();

    const { state } = useBrukerContext();

    if (isEmpty(state)) return null;

    return (
        <SkjemaGruppe>
            <br />
            <Alert variant={"warning"}>{t("omDeg.advarsel")}</Alert>
            <p className="mute">{t("omDeg.valgfritt")}</p>
            <br />
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

                    <div>
                        <Label>{t("felles.adresse")}</Label>
                        <BodyShort spacing>
                            {state.adresse}
                            {state.husnummer ? ` ${state.husnummer}` : ""}
                            {state.husbokstav ? ` ${state.husbokstav}` : ""}, {state.postnummer} {state.poststed}
                        </BodyShort>
                    </div>
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
