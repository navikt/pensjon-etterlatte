import { SkjemaGruppe } from "nav-frontend-skjema";
import { RHFBicInput, RHFIbanInput, RHFInput } from "../../../felles/RHFInput";
import React from "react";
import { useTranslation } from "react-i18next";
import {Heading, HelpText} from "@navikt/ds-react";
import styled from "styled-components";

const HelpTextLabel = styled.div`
    display: flex;
`

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
                    <HelpTextLabel>
                        {t("omDeg.utbetalingsInformasjon.iban")}
                        &nbsp;<HelpText>{t("omDeg.utbetalingsInformasjon.ibanHjelpetekst")}</HelpText>
                    </HelpTextLabel>
                )}
            />

            <RHFBicInput
                name={"utbetalingsInformasjon.swift"}
                bredde={"M"}
                label={(
                    <HelpTextLabel>
                        {t("omDeg.utbetalingsInformasjon.swift")}
                        &nbsp;<HelpText>{t("omDeg.utbetalingsInformasjon.swiftHjelpetekst")}</HelpText>
                    </HelpTextLabel>
                )}
            />

        </>
    )
}

export default UtenlandskBankInfo
