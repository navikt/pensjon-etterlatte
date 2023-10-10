import { useTranslation } from 'react-i18next'
import React from 'react'
import { Alert, BodyShort, Heading } from '@navikt/ds-react'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { RHFValutaInput } from '../../../felles/rhf/RHFInput'
import HvorforSpoerVi from '../../../felles/HvorforSpoerVi'
import Bredde from '../../../../typer/bredde'
import { InputWithCurrency } from '../../../felles/StyledComponents'
import { useFormContext } from 'react-hook-form'
import { IInntekt } from '../../../../typer/inntekt'

const Loennsinntekt = () => {
    const { t } = useTranslation()

    const {
        formState: { errors },
    } = useFormContext<IInntekt>()

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <Heading size={'medium'}>{t('inntektenDin.loennsinntekt.tittel')}</Heading>
                <BodyShort>{t('inntektenDin.loennsinntekt.ingress')}</BodyShort>
            </SkjemaElement>

            <SkjemaElement>
                <Heading size={'small'}>{t('inntektenDin.loennsinntekt.arbeidsinntektAaretFoer.tittel')}</Heading>
            </SkjemaElement>
            <SkjemaElement>
                <InputWithCurrency $hasError={!!errors.loennsinntekt?.arbeidsinntektAaretFoer}>
                    <RHFValutaInput
                        name={'loennsinntekt.arbeidsinntektAaretFoer'}
                        label={t('inntektenDin.loennsinntekt.arbeidsinntektAaretFoer')}
                        description={t('inntektenDin.loennsinntekt.arbeidsinntektAaretFoer.beskrivelse')}
                        htmlSize={Bredde.S}
                    />
                    <BodyShort className="currency">{t('felles.kroner')}</BodyShort>
                </InputWithCurrency>
                <HvorforSpoerVi title={'loennsinntekt.arbeidsinntektAaretFoer'}>
                    {t('inntektenDin.loennsinntekt.arbeidsinntektAaretFoer.hvorfor')}
                </HvorforSpoerVi>
            </SkjemaElement>

            <SkjemaElement>
                <Heading size={'small'}>{t('inntektenDin.loennsinntekt.arbeidsinntektIAar.tittel')}</Heading>
            </SkjemaElement>
            <SkjemaElement>
                <InputWithCurrency $hasError={!!errors.loennsinntekt?.arbeidsinntektIAar?.tilDoedsfall}>
                    <RHFValutaInput
                        name={'loennsinntekt.arbeidsinntektIAar.tilDoedsfall'}
                        label={t('inntektenDin.loennsinntekt.arbeidsinntektIAar.tilDoedsfall')}
                        description={t('inntektenDin.loennsinntekt.arbeidsinntektIAar.tilDoedsfall.beskrivelse')}
                        htmlSize={Bredde.S}
                    />
                    <BodyShort className="currency">{t('felles.kroner')}</BodyShort>
                </InputWithCurrency>
            </SkjemaElement>
            <SkjemaElement>
                <InputWithCurrency $hasError={!!errors.loennsinntekt?.arbeidsinntektIAar?.etterDoedsfall}>
                    <RHFValutaInput
                        name={'loennsinntekt.arbeidsinntektIAar.etterDoedsfall'}
                        label={t('inntektenDin.loennsinntekt.arbeidsinntektIAar.etterDoedsfall')}
                        description={t('inntektenDin.loennsinntekt.arbeidsinntektIAar.etterDoedsfall.beskrivelse')}
                        htmlSize={Bredde.S}
                    />
                    <BodyShort className="currency">{t('felles.kroner')}</BodyShort>
                </InputWithCurrency>
            </SkjemaElement>

            <Alert variant={'info'}>{t('inntektenDin.loennsinntekt.info')}</Alert>
        </SkjemaGruppe>
    )
}

export default Loennsinntekt
