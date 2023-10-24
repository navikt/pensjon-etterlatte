import { useTranslation } from 'react-i18next'
import React from 'react'
import { Alert, BodyShort, Heading } from '@navikt/ds-react'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { RHFValutaInput } from '../../../felles/rhf/RHFInput'
import Bredde from '../../../../typer/bredde'
import EndringInntekt from './EndringInntekt'

const Naeringsinntekt = () => {
    const { t } = useTranslation()

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <Heading size={'medium'}>{t('inntektenDin.naeringsinntekt.tittel')}</Heading>
                <BodyShort>{t('inntektenDin.naeringsinntekt.ingress')}</BodyShort>
            </SkjemaElement>

            <SkjemaGruppe>
                <SkjemaElement>
                    <Heading size={'small'}>{t('inntektenDin.naeringsinntekt.arbeidsinntektAaretFoer.tittel')}</Heading>
                </SkjemaElement>
                <SkjemaElement>
                    <RHFValutaInput
                        name={'naeringsinntekt.arbeidsinntektAaretFoer'}
                        label={t('inntektenDin.naeringsinntekt.arbeidsinntektAaretFoer')}
                        description={t('inntektenDin.naeringsinntekt.arbeidsinntektAaretFoer.beskrivelse')}
                        htmlSize={Bredde.S}
                    />
                </SkjemaElement>
            </SkjemaGruppe>
            <SkjemaGruppe>
                <SkjemaElement>
                    <Heading size={'small'}>{t('inntektenDin.naeringsinntekt.arbeidsinntektIAar.tittel')}</Heading>
                </SkjemaElement>
                <SkjemaElement>
                    <RHFValutaInput
                        name={'naeringsinntekt.arbeidsinntektIAar.tilDoedsfall'}
                        label={t('inntektenDin.naeringsinntekt.arbeidsinntektIAar.tilDoedsfall')}
                        description={t('inntektenDin.naeringsinntekt.arbeidsinntektIAar.tilDoedsfall.beskrivelse')}
                        htmlSize={Bredde.S}
                    />
                </SkjemaElement>
                <SkjemaElement>
                    <RHFValutaInput
                        name={'naeringsinntekt.arbeidsinntektIAar.etterDoedsfall'}
                        label={t('inntektenDin.naeringsinntekt.arbeidsinntektIAar.etterDoedsfall')}
                        description={t('inntektenDin.naeringsinntekt.arbeidsinntektIAar.etterDoedsfall.beskrivelse')}
                        htmlSize={Bredde.S}
                    />
                </SkjemaElement>
            </SkjemaGruppe>
            <EndringInntekt type={'naeringsinntekt'} />

            <Alert variant={'info'}>{t('inntektenDin.naeringsinntekt.info')}</Alert>
        </SkjemaGruppe>
    )
}

export default Naeringsinntekt
