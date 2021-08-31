import AlertStripe from "nav-frontend-alertstriper";
import { Element, Normaltekst } from "nav-frontend-typografi";
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
            {/* TODO: Ikke lagre innlogget bruker? */}
            <br />
            <AlertStripe type="advarsel">{t("omDeg.advarsel")}</AlertStripe>
            <br />

            <Grid className={"opplysninger"}>
                <Cell xs={6}>
                    <div>
                        <Element>{t("felles.navn")}</Element>
                        <Normaltekst>
                            {state.fornavn} {state.etternavn}
                        </Normaltekst>
                    </div>

                    <div>
                        <Element>{t("felles.fnrDnr")}</Element>
                        <Normaltekst>{state.foedselsnummer}</Normaltekst>
                    </div>

                    <div>
                        <Element>{t("felles.adresse")}</Element>
                        <Normaltekst>
                            {state.adresse}
                            {state.husnummer ? ` ${state.husnummer}` : ""}
                            {state.husbokstav ? ` ${state.husbokstav}` : ""}, {state.postnummer} {state.poststed}
                        </Normaltekst>
                    </div>
                </Cell>

                <Cell xs={6}>
                    <div>
                        <Element>{t("felles.sivilstatus")}</Element>
                        <Normaltekst>{state.sivilstatus}</Normaltekst>
                    </div>

                    <div>
                        <Element>{t("felles.statsborgerskap")}</Element>
                        <Normaltekst>{state.statsborgerskap}</Normaltekst>
                    </div>
                </Cell>
            </Grid>
        </SkjemaGruppe>
    );
});

export default InnloggetBruker;
