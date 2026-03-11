import { Box, Heading, VStack } from '@navikt/ds-react'
import { fnr } from '@navikt/fnrvalidator'
import { useTranslation } from 'react-i18next'
import Bredde from '../../../../typer/bredde'
import { RHFFoedselsnummerInput, RHFInput } from '../../../felles/rhf/RHFInput'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'

export const SamboerSkjema = () => {
    const { t } = useTranslation()

    return (
        <Box
            marginBlock="4"
            padding="4"
            borderColor={'border-info'}
            borderWidth={'0 0 0 4'}
            background={'surface-selected'}
        >
            <VStack gap="4" marginBlock={'4'}>
                <Heading size={'small'}>{t('situasjonenDin.nySivilstatus.samboerskap.samboer.tittel')}</Heading>

                <RHFInput
                    name={'nySivilstatus.samboerskap.samboer.fornavn'}
                    label={t('situasjonenDin.nySivilstatus.samboerskap.samboer.fornavn')}
                    htmlSize={Bredde.M}
                />
                <RHFInput
                    name={'nySivilstatus.samboerskap.samboer.etternavn'}
                    label={t('situasjonenDin.nySivilstatus.samboerskap.samboer.etternavn')}
                    htmlSize={Bredde.M}
                />
                <RHFFoedselsnummerInput
                    name={'nySivilstatus.samboerskap.samboer.foedselsnummer'}
                    htmlSize={Bredde.S}
                    label={t('felles.fnr')}
                    rules={{ validate: (value) => fnr(value).status === 'valid' }}
                />
                <RHFSpoersmaalRadio
                    name={'nySivilstatus.samboerskap.hattBarnEllerVaertGift'}
                    legend={t('situasjonenDin.nySivilstatus.samboerskap.hattBarnEllerVaertGift')}
                />
            </VStack>
        </Box>
    )
}
