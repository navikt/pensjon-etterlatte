import { RHFBicInput, RHFIbanInput, RHFInput } from '../../../felles/rhf/RHFInput'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Heading, HelpText } from '@navikt/ds-react'
import styled from 'styled-components'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import Bredde from '../../../../typer/bredde'

const HelpTextLabel = styled.div`
    display: flex;
`

const UtenlandskBankInfo = ({ kontonummerTilhoererBarn = false }: { kontonummerTilhoererBarn?: boolean }) => {
    const { t } = useTranslation()

    const prefix = kontonummerTilhoererBarn ? 'barnepensjon.' : ''
    return (
        <>
            <SkjemaElement>
                <Heading size={'small'}>{t('omDeg.utbetalingsInformasjon.tittel')}</Heading>
            </SkjemaElement>

            <SkjemaElement>
                <RHFInput
                    name={`${prefix}utbetalingsInformasjon.utenlandskBankNavn`}
                    label={t('omDeg.utbetalingsInformasjon.utenlandskBankNavn')}
                    autoComplete="off"
                />
            </SkjemaElement>

            <SkjemaElement>
                <RHFInput
                    name={`${prefix}utbetalingsInformasjon.utenlandskBankAdresse`}
                    label={t('omDeg.utbetalingsInformasjon.utenlandskBankAdresse')}
                    autoComplete="off"
                />
            </SkjemaElement>
            <SkjemaElement>
                <RHFIbanInput
                    name={`${prefix}utbetalingsInformasjon.iban`}
                    htmlSize={Bredde.M}
                    label={
                        <HelpTextLabel>
                            {t('omDeg.utbetalingsInformasjon.iban')}
                            &nbsp;<HelpText>{t('omDeg.utbetalingsInformasjon.ibanHjelpetekst')}</HelpText>
                        </HelpTextLabel>
                    }
                    autoComplete="off"
                />
            </SkjemaElement>
            <SkjemaElement>
                <RHFBicInput
                    name={`${prefix}utbetalingsInformasjon.swift`}
                    htmlSize={Bredde.S}
                    label={
                        <HelpTextLabel>
                            {t('omDeg.utbetalingsInformasjon.swift')}
                            &nbsp;<HelpText>{t('omDeg.utbetalingsInformasjon.swiftHjelpetekst')}</HelpText>
                        </HelpTextLabel>
                    }
                    autoComplete="off"
                />
            </SkjemaElement>
        </>
    )
}

export default UtenlandskBankInfo
