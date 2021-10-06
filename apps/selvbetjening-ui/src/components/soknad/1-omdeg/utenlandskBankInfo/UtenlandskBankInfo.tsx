import { SkjemaGruppe } from "nav-frontend-skjema";
import { RHFBicInput, RHFIbanInput, RHFInput } from "../../../felles/RHFInput";
import React from "react";
import { useTranslation } from "react-i18next";
import Hjelpetekst from "../../../felles/Hjelpetekst";
import { Heading } from "@navikt/ds-react";

const UtenlandskBankInfo = () => {
    const { t } = useTranslation()

    return (
        <>
            <SkjemaGruppe>
                <Heading size={"small"}>{t("omDeg.utbetalingsInformasjon.tittel")}</Heading>
            </SkjemaGruppe>

            <RHFInput
                name={"utbetalingsInformasjon.utenlandskBankNavn"}
                label={t("omDeg.utbetalingsInformasjon.utenlandskBankNavn")}
            />

            <RHFInput
                name={"utbetalingsInformasjon.utenlandskBankAdresse"}
                label={t("omDeg.utbetalingsInformasjon.utenlandskBankAdresse")}
            />

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

        </>
    )
}

export default UtenlandskBankInfo
