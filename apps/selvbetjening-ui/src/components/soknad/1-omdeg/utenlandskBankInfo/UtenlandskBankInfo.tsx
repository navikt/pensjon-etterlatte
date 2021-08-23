import { SkjemaGruppe } from "nav-frontend-skjema";
import { Undertittel } from "nav-frontend-typografi";
import { RHFBicInput, RHFIbanInput, RHFInput } from "../../../felles/RHFInput";
import React from "react";
import { useTranslation } from "react-i18next";
import Hjelpetekst from "nav-frontend-hjelpetekst";

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
                    bredde={"XL"}
                    label={(
                        <>
                            {t("omDeg.utbetalingsInformasjon.iban")}
                            &nbsp;<Hjelpetekst>{t("omDeg.utbetalingsInformasjon.ibanHjelpetekst")}</Hjelpetekst>
                        </>
                    )}
                />
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFBicInput
                    name={"utbetalingsInformasjon.swift"}
                    bredde={"M"}
                    label={(
                        <>
                            {t("omDeg.utbetalingsInformasjon.swift")}
                            &nbsp;<Hjelpetekst>{t("omDeg.utbetalingsInformasjon.swiftHjelpetekst")}</Hjelpetekst>
                        </>
                    )}
                />
            </SkjemaGruppe>
        </>
    )
}

export default UtenlandskBankInfo
