import { useTranslation } from 'react-i18next'
import { RHFFoedselsnummerInput, RHFInput } from '../../../felles/rhf/RHFInput'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { fnr } from '@navikt/fnrvalidator'
import { Panel, Heading, HGrid } from '@navikt/ds-react'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import Bredde from '../../../../typer/bredde'

const SamboerSkjema = () => {
    const { t } = useTranslation()

    return (
        <SkjemaElement>
            <Panel border>
                <SkjemaElement>
                    <Heading size={'small'}>{t('omDeg.nySivilstatus.samboerskap.samboer.tittel')}</Heading>
                </SkjemaElement>

                <SkjemaElement>
                    <HGrid gap={'4'} columns={{ xs: 1, sm: 2 }} align={'start'}>
                        <RHFInput
                            name={'nySivilstatus.samboerskap.samboer.fornavn'}
                            label={t('omDeg.nySivilstatus.samboerskap.samboer.fornavn')}
                        />
                        <RHFInput
                            name={'nySivilstatus.samboerskap.samboer.etternavn'}
                            label={t('omDeg.nySivilstatus.samboerskap.samboer.etternavn')}
                        />
                    </HGrid>
                </SkjemaElement>

                <SkjemaElement>
                    <RHFFoedselsnummerInput
                        name={'nySivilstatus.samboerskap.samboer.foedselsnummer'}
                        htmlSize={Bredde.S}
                        label={t('felles.fnr')}
                        description={t('felles.fnrPlaceholder')}
                        rules={{ validate: (value) => fnr(value).status === 'valid' }}
                    />
                </SkjemaElement>

                <SkjemaElement>
                    <RHFSpoersmaalRadio
                        name={'nySivilstatus.samboerskap.hattBarnEllerVaertGift'}
                        legend={t('omDeg.nySivilstatus.samboerskap.hattBarnEllerVaertGift')}
                    />
                </SkjemaElement>
            </Panel>
        </SkjemaElement>
    )
}

export default SamboerSkjema
