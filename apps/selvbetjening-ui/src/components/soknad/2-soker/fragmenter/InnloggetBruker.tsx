import AlertStripe from "nav-frontend-alertstriper";
import { Element, Normaltekst } from "nav-frontend-typografi";
import { useTranslation } from "react-i18next";
import { useBrukerContext } from "../../../../context/bruker/BrukerContext";
import Panel from "nav-frontend-paneler";
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

            <Panel border className={"opplysninger"}>
                <section>
                    <Element>{t("felles.fnrDnr")}</Element>
                    <Normaltekst>{state.foedselsnummer}</Normaltekst>
                </section>

                <section>
                    <Element>{t("felles.navn")}</Element>
                    <Normaltekst>
                        {state.fornavn} {state.etternavn}
                    </Normaltekst>
                </section>

                {/* 2.3 */}
                <section>
                    <Element>{t("felles.adresse")}</Element>
                    <Normaltekst>{state.adresse}</Normaltekst>
                </section>

                <section>
                    <Element>{t("felles.sivilstatus")}</Element>
                    <Normaltekst>{state.sivilstatus}</Normaltekst>
                </section>

                {/* 2.6 */}
                <section>
                    <Element>{t("felles.statsborgerskap")}</Element>
                    <Normaltekst>{state.statsborgerskap}</Normaltekst>
                </section>
            </Panel>
        </SkjemaGruppe>
    );
};

export default InnloggetBruker;
