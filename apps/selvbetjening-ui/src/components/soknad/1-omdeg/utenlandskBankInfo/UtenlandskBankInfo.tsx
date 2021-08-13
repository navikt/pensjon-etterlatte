import { SkjemaGruppe } from "nav-frontend-skjema";
import { Undertittel } from "nav-frontend-typografi";
import { RHFBicInput, RHFIbanInput, RHFInput } from "../../../felles/RHFInput";
import React from "react";
import { useTranslation } from "react-i18next";

const UtenlandskBankInfo = () => {
    const { t } = useTranslation()

    return (
        <>
            <SkjemaGruppe>
                <Undertittel>{t("omDeg.utbetalingsInformasjon.tittel")}</Undertittel>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFInput
                    name={"utbetalingsInformasjon.utenlandskBankNavn"}
                    label={t("omDeg.utbetalingsInformasjon.utenlandskBankNavn")}
                />
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFInput
                    name={"utbetalingsInformasjon.utenlandskBankAdresse"}
                    label={t("omDeg.utbetalingsInformasjon.utenlandskBankAdresse")}
                />
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFIbanInput
                    name={"utbetalingsInformasjon.iban"}
                    label={t("omDeg.utbetalingsInformasjon.iban")}
                    hjelpetekstIkon={t("omDeg.utbetalingsInformasjon.ibanHjelpetekst")}
                />
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFBicInput
                    name={"utbetalingsInformasjon.swift"}
                    label={t("omDeg.utbetalingsInformasjon.swift")}
                    hjelpetekstIkon={t("omDeg.utbetalingsInformasjon.swiftHjelpetekst")}
                />
            </SkjemaGruppe>
        </>
    )
}

export default UtenlandskBankInfo
