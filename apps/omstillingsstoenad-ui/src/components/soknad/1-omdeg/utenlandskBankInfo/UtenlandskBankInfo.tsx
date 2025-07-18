import { Box, Heading, HelpText, HStack } from '@navikt/ds-react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Bredde from '../../../../typer/bredde'
import { RHFBicInput, RHFIbanInput, RHFInput } from '../../../felles/rhf/RHFInput'

const UtenlandskBankInfo = ({ kontonummerTilhoererBarn = false }: { kontonummerTilhoererBarn?: boolean }) => {
    const { t } = useTranslation()

    const prefix = kontonummerTilhoererBarn ? 'barnepensjon.' : ''
    return (
        <>
            <Box marginBlock="4">
                <Heading size={'small'}>{t('omDeg.utbetalingsInformasjon.tittel')}</Heading>
            </Box>

            <Box marginBlock="4">
                <RHFInput
                    name={`${prefix}utbetalingsInformasjon.utenlandskBankNavn`}
                    label={t('omDeg.utbetalingsInformasjon.utenlandskBankNavn')}
                    autoComplete="off"
                />
            </Box>

            <Box marginBlock="4">
                <RHFInput
                    name={`${prefix}utbetalingsInformasjon.utenlandskBankAdresse`}
                    label={t('omDeg.utbetalingsInformasjon.utenlandskBankAdresse')}
                    autoComplete="off"
                />
            </Box>
            <Box marginBlock="4">
                <RHFIbanInput
                    name={`${prefix}utbetalingsInformasjon.iban`}
                    htmlSize={Bredde.M}
                    label={
                        <HStack align="center">
                            {t('omDeg.utbetalingsInformasjon.iban')}
                            &nbsp;<HelpText>{t('omDeg.utbetalingsInformasjon.ibanHjelpetekst')}</HelpText>
                        </HStack>
                    }
                    autoComplete="off"
                />
            </Box>
            <Box marginBlock="4">
                <RHFBicInput
                    name={`${prefix}utbetalingsInformasjon.swift`}
                    htmlSize={Bredde.S}
                    label={
                        <HStack align="center">
                            {t('omDeg.utbetalingsInformasjon.swift')}
                            &nbsp;<HelpText>{t('omDeg.utbetalingsInformasjon.swiftHjelpetekst')}</HelpText>
                        </HStack>
                    }
                    autoComplete="off"
                />
            </Box>
        </>
    )
}

export default UtenlandskBankInfo
