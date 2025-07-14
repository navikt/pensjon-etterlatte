import { Box, Heading, HGrid } from '@navikt/ds-react'
import { fnr } from '@navikt/fnrvalidator'
import { useTranslation } from 'react-i18next'
import Bredde from '../../../../typer/bredde'
import { RHFFoedselsnummerInput, RHFInput } from '../../../felles/rhf/RHFInput'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'

const SamboerSkjema = () => {
    const { t } = useTranslation()

    return (
        <Box
            marginBlock="4"
            padding="4"
            borderColor={'border-info'}
            borderWidth={'0 0 0 4'}
            background={'surface-selected'}
        >
            <Box marginBlock="4">
                <Heading size={'small'}>{t('situasjonenDin.nySivilstatus.samboerskap.samboer.tittel')}</Heading>
            </Box>

            <Box marginBlock="4">
                <HGrid gap={'4'} columns={{ xs: 1, sm: 2 }} align={'start'}>
                    <RHFInput
                        name={'nySivilstatus.samboerskap.samboer.fornavn'}
                        label={t('situasjonenDin.nySivilstatus.samboerskap.samboer.fornavn')}
                    />
                    <RHFInput
                        name={'nySivilstatus.samboerskap.samboer.etternavn'}
                        label={t('situasjonenDin.nySivilstatus.samboerskap.samboer.etternavn')}
                    />
                </HGrid>
            </Box>

            <Box marginBlock="4">
                <RHFFoedselsnummerInput
                    name={'nySivilstatus.samboerskap.samboer.foedselsnummer'}
                    htmlSize={Bredde.S}
                    label={t('felles.fnr')}
                    rules={{ validate: (value) => fnr(value).status === 'valid' }}
                />
            </Box>

            <Box marginBlock="4">
                <RHFSpoersmaalRadio
                    name={'nySivilstatus.samboerskap.hattBarnEllerVaertGift'}
                    legend={t('situasjonenDin.nySivilstatus.samboerskap.hattBarnEllerVaertGift')}
                />
            </Box>
        </Box>
    )
}

export default SamboerSkjema
