import { useTranslation } from 'react-i18next'
import React from 'react'
import { Alert, BodyShort, Heading } from '@navikt/ds-react'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { RHFValutaInput } from '../../../felles/rhf/RHFInput'
import Bredde from '../../../../typer/bredde'
import EndringInntekt from './EndringInntekt'

const Loennsinntekt = () => {
    const { t } = useTranslation()

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <Heading size={'medium'}>{t('inntektenDin.loennsinntekt.tittel')}</Heading>
                <BodyShort>{t('inntektenDin.loennsinntekt.ingress')}</BodyShort>
            </SkjemaElement>

            <SkjemaElement>
                <Heading size={'small'}>{t('inntektenDin.loennsinntekt.arbeidsinntektAaretFoer.tittel')}</Heading>
            </SkjemaElement>
            <SkjemaGruppe>
                <RHFValutaInput
                    name={'loennsinntekt.arbeidsinntektAaretFoer'}
                    label={t('inntektenDin.loennsinntekt.arbeidsinntektAaretFoer')}
                    description={t('inntektenDin.loennsinntekt.arbeidsinntektAaretFoer.beskrivelse')}
                    htmlSize={Bredde.S}
                />
            </SkjemaGruppe>

            <SkjemaGruppe>
                <SkjemaElement>
                    <Heading size={'small'}>{t('inntektenDin.loennsinntekt.arbeidsinntektIAar.tittel')}</Heading>
                </SkjemaElement>
                <SkjemaElement>
                    <RHFValutaInput
                        name={'loennsinntekt.arbeidsinntektIAar.tilDoedsfall'}
                        label={t('inntektenDin.loennsinntekt.arbeidsinntektIAar.tilDoedsfall')}
                        description={t('inntektenDin.loennsinntekt.arbeidsinntektIAar.tilDoedsfall.beskrivelse')}
                        htmlSize={Bredde.S}
                    />
                </SkjemaElement>
                <SkjemaElement>
                    <RHFValutaInput
                        name={'loennsinntekt.arbeidsinntektIAar.etterDoedsfall'}
                        label={t('inntektenDin.loennsinntekt.arbeidsinntektIAar.etterDoedsfall')}
                        description={t('inntektenDin.loennsinntekt.arbeidsinntektIAar.etterDoedsfall.beskrivelse')}
                        htmlSize={Bredde.S}
                    />
                </SkjemaElement>
            </SkjemaGruppe>
            <Alert variant={'info'}>{t('inntektenDin.loennsinntekt.info')}</Alert>

            <EndringInntekt type={'loennsinntekt'} />
        </SkjemaGruppe>
    )
}

export default Loennsinntekt
