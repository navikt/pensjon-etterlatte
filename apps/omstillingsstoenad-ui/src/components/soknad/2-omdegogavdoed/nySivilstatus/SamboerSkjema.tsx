import { useTranslation } from 'react-i18next'
import { ISoeker } from '../../../../typer/person'
import { useFormContext } from 'react-hook-form'
import { RHFFoedselsnummerInput, RHFInput } from '../../../felles/rhf/RHFInput'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { IValg } from '../../../../typer/Spoersmaal'
import { fnr } from '@navikt/fnrvalidator'
import { Panel, Heading, HGrid } from '@navikt/ds-react'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import Bredde from '../../../../typer/bredde'

const SamboerSkjema = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<ISoeker>()

    const harVaertGift = watch('nySivilstatus.samboerskap.hattBarnEllerVaertGift')

    return (
        <SkjemaElement>
            <Panel border>
                <SkjemaElement>
                    <Heading size={'small'}>{t('omDegOgAvdoed.nySivilstatus.samboerskap.samboer.tittel')}</Heading>
                </SkjemaElement>

                <SkjemaElement>
                    <HGrid gap={'4'} columns={{ xs: 1, sm: 2 }} align={'start'}>
                        <RHFInput
                            name={'nySivilstatus.samboerskap.samboer.fornavn'}
                            label={t('omDegOgAvdoed.nySivilstatus.samboerskap.samboer.fornavn')}
                        />
                        <RHFInput
                            name={'nySivilstatus.samboerskap.samboer.etternavn'}
                            label={t('omDegOgAvdoed.nySivilstatus.samboerskap.samboer.etternavn')}
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
                        legend={t('omDegOgAvdoed.nySivilstatus.samboerskap.hattBarnEllerVaertGift')}
                    />
                </SkjemaElement>

                {harVaertGift === IValg.NEI && (
                    <SkjemaElement>
                        <RHFSpoersmaalRadio
                            name={'nySivilstatus.samboerskap.samboer.harInntekt.svar'}
                            legend={t('omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.svar')}
                        />
                    </SkjemaElement>
                )}
            </Panel>
        </SkjemaElement>
    )
}

export default SamboerSkjema
