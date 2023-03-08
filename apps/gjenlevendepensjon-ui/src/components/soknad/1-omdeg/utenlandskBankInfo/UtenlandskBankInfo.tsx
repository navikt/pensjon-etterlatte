import { RHFBicInput, RHFIbanInput, RHFInput } from "../../../felles/RHFInput";
import React from "react";
import { useTranslation } from "react-i18next";
import {Heading, HelpText} from "@navikt/ds-react";
import styled from "styled-components";
import {SkjemaElement} from "../../../felles/SkjemaElement";
import {Bredde} from "../../../../typer/bredde";

const HelpTextLabel = styled.div`
    display: flex;
`

const UtenlandskBankInfo = () => {
    const { t } = useTranslation()

    return (
        <>
            <SkjemaElement>
                <Heading size={"small"}>{t("omDeg.utbetalingsInformasjon.tittel")}</Heading>
            </SkjemaElement>

            <SkjemaElement>
                <RHFInput
                    name={"utbetalingsInformasjon.utenlandskBankNavn"}
                    label={t("omDeg.utbetalingsInformasjon.utenlandskBankNavn")}
                />
            </SkjemaElement>

            <SkjemaElement>
                <RHFInput
                    name={"utbetalingsInformasjon.utenlandskBankAdresse"}
                    label={t("omDeg.utbetalingsInformasjon.utenlandskBankAdresse")}
                />
            </SkjemaElement>
            <SkjemaElement>
                <RHFIbanInput
                    name={"utbetalingsInformasjon.iban"}
                    htmlSize={Bredde.M}
                    label={(
                        <HelpTextLabel>
                            {t("omDeg.utbetalingsInformasjon.iban")}
                            &nbsp;<HelpText>{t("omDeg.utbetalingsInformasjon.ibanHjelpetekst")}</HelpText>
                        </HelpTextLabel>
                    )}
                />
            </SkjemaElement>
            <SkjemaElement>
                <RHFBicInput
                    name={"utbetalingsInformasjon.swift"}
                    htmlSize={Bredde.S}
                    label={(
                        <HelpTextLabel>
                            {t("omDeg.utbetalingsInformasjon.swift")}
                            &nbsp;<HelpText>{t("omDeg.utbetalingsInformasjon.swiftHjelpetekst")}</HelpText>
                        </HelpTextLabel>
                    )}
                />
            </SkjemaElement>

        </>
    )
}

export default UtenlandskBankInfo
