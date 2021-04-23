import AlertStripe from "nav-frontend-alertstriper";
import { Element, Normaltekst } from "nav-frontend-typografi";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { hentInnloggetPerson } from "../../../../api";
import { ActionTypes, IBruker } from "../../../../context/bruker/bruker";
import { useBrukerContext } from "../../../../context/bruker/BrukerContext";

const InnloggetBruker = () => {
    const { t } = useTranslation();

    const { state, dispatch } = useBrukerContext();

    useEffect(() => {
        if (!state.foedselsnummer) {
            hentInnloggetPerson().then((person: IBruker) => {
                dispatch({ type: ActionTypes.HENT_INNLOGGET_BRUKER, payload: person });
            });
        }
    }, [state.foedselsnummer, dispatch]);

    return (
        <>
            {/* TODO: Ikke lagre innlogget bruker? */}
            <br />
            <AlertStripe type="advarsel">{t("omSoekeren.advarsel")}</AlertStripe>
            <br />

            <div className={"opplysninger"}>
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
            </div>
        </>
    );
};

export default InnloggetBruker;
