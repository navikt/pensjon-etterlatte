import React, { FC } from "react";
import AlertStripe from "nav-frontend-alertstriper";
import { Element, Normaltekst } from "nav-frontend-typografi";
import ToValgRadio from "../../felles/ToValgRadio";
import { ActionTypes } from "../../../context/soknad/soknad";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { useTranslation } from "react-i18next";

const InnloggetBruker: FC = () => {
    const { t } = useTranslation();

    const { state, dispatch } = useSoknadContext();
    const { opplysningerOmSoekeren } = state;

    return (
        <>
            <br />
            <AlertStripe type="advarsel">{t("omSoekeren.advarsel")}</AlertStripe>
            <br />

            {!!opplysningerOmSoekeren && (
                <div className={"opplysninger"}>
                    <section>
                        <Element>{t("felles.fnrDnr")}</Element>
                        <Normaltekst>{opplysningerOmSoekeren.foedselsnummer}</Normaltekst>
                    </section>

                    <section>
                        <Element>{t("felles.navn")}</Element>
                        <Normaltekst>
                            {opplysningerOmSoekeren.navn?.fornavn} {opplysningerOmSoekeren.navn?.etternavn}
                        </Normaltekst>
                    </section>

                    {/* 2.3 */}
                    <section>
                        <Element>{t("felles.adresse")}</Element>
                        <Normaltekst>{opplysningerOmSoekeren.bosted?.adresse}</Normaltekst>
                    </section>

                    <section>
                        <Element>{t("felles.sivilstatus")}</Element>
                        <Normaltekst>{opplysningerOmSoekeren.sivilstatus}</Normaltekst>
                    </section>

                    {/* 2.6 */}
                    <section>
                        <Element>{t("felles.statsborgerskap")}</Element>
                        <Normaltekst>{opplysningerOmSoekeren.statsborgerskap}</Normaltekst>
                    </section>
                </div>
            )}

            <ToValgRadio
                label={t("omSoekeren.borPaaAdresse")}
                checked={opplysningerOmSoekeren?.bosted?.boadresseBekreftet}
                invert={true}
                onChange={(valgtSvar) => {
                    dispatch({ type: ActionTypes.BEKREFT_BOADRESSE, payload: valgtSvar });
                }}
            >
                <AlertStripe type="advarsel" form={"inline"}>
                    {t("omSoekeren.infoFolkeregisteret")}
                </AlertStripe>
            </ToValgRadio>
        </>
    );
};

export default InnloggetBruker;
