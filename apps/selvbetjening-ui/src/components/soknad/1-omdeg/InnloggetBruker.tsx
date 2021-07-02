import AlertStripe from "nav-frontend-alertstriper";
import { Element, Normaltekst } from "nav-frontend-typografi";
import { useTranslation } from "react-i18next";
import { useBrukerContext } from "../../../context/bruker/BrukerContext";
import { SkjemaGruppe } from "nav-frontend-skjema";

const InnloggetBruker = () => {
    const { t } = useTranslation();

    const { state } = useBrukerContext();

    return (
        <SkjemaGruppe>
            {/* TODO: Ikke lagre innlogget bruker? */}
            <br />
            <AlertStripe type="advarsel">{t("omSoekeren.advarsel")}</AlertStripe>
            <br />

            <div className={"opplysninger rad"}>
                <div className={"kolonne"}>
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
                        <Normaltekst>{state.adresse}</Normaltekst>
                    </div>
                </div>

                <div className={"kolonne"}>
                    <div>
                        <Element>{t("felles.sivilstatus")}</Element>
                        <Normaltekst>{state.sivilstatus}</Normaltekst>
                    </div>

                    <div>
                        <Element>{t("felles.statsborgerskap")}</Element>
                        <Normaltekst>{state.statsborgerskap}</Normaltekst>
                    </div>
                </div>
            </div>
        </SkjemaGruppe>
    );
};

export default InnloggetBruker;
