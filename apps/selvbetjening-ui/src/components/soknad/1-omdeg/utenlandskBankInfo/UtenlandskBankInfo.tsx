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
                <Undertittel>{t("Oppgi bankopplysninger")}</Undertittel>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFInput
                    name={"utbetalingsInformasjon.utenlandskBankNavn"}
                    label={t("Bankens navn")}
                />
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFInput
                    name={"utbetalingsInformasjon.utenlandskBankAdresse"}
                    label={t("Bankens fulle adresse")}
                />
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFIbanInput
                    name={"utbetalingsInformasjon.iban"}
                    label={t("IBAN-nummer")}
                    hjelpetekstIkon={"IBAN står for International Bank Account Number og er en internasjonal standard for kontonummer."}
                />
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFBicInput
                    name={"utbetalingsInformasjon.swift"}
                    label={t("Bankens S.W.I.F.T (BIC) adresse")}
                    hjelpetekstIkon={"BIC står for Bank Identifier Code, og er den koden som identifiserer banken. BIC kalles også SWIFT, og er påkrevd ved betaling til en rekke land, og alltid når man bruker IBAN."}
                />
            </SkjemaGruppe>
        </>
    )
}

export default UtenlandskBankInfo
