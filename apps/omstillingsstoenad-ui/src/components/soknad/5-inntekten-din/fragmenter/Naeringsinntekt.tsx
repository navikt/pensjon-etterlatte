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

const Naeringsinntekt = () => {
    const { t } = useTranslation()

    const {
        formState: { errors },
    } = useFormContext<IInntekt>()

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <Heading size={'medium'}>{t('inntektenDin.naeringsinntekt.tittel')}</Heading>
                <BodyShort>{t('inntektenDin.naeringsinntekt.ingress')}</BodyShort>
            </SkjemaElement>

            <SkjemaElement>
                <Heading size={'small'}>{t('inntektenDin.naeringsinntekt.arbeidsinntektAaretFoer.tittel')}</Heading>
            </SkjemaElement>
            <SkjemaElement>
                <InputWithCurrency $hasError={!!errors.naeringsinntekt?.arbeidsinntektAaretFoer}>
                    <RHFValutaInput
                        name={'naeringsinntekt.arbeidsinntektAaretFoer'}
                        label={t('inntektenDin.naeringsinntekt.arbeidsinntektAaretFoer')}
                        description={t('inntektenDin.naeringsinntekt.arbeidsinntektAaretFoer.beskrivelse')}
                        htmlSize={Bredde.S}
                    />
                    <BodyShort className="currency">{t('felles.kroner')}</BodyShort>
                </InputWithCurrency>
                <HvorforSpoerVi title={'naeringsinntekt.arbeidsinntektAaretFoer'}>
                    {t('inntektenDin.naeringsinntekt.arbeidsinntektAaretFoer.hvorfor')}
                </HvorforSpoerVi>
            </SkjemaElement>

            <SkjemaElement>
                <Heading size={'small'}>{t('inntektenDin.naeringsinntekt.arbeidsinntektIAar.tittel')}</Heading>
            </SkjemaElement>
            <SkjemaElement>
                <InputWithCurrency $hasError={!!errors.naeringsinntekt?.arbeidsinntektIAar?.tilDoedsfall}>
                    <RHFValutaInput
                        name={'naeringsinntekt.arbeidsinntektIAar.tilDoedsfall'}
                        label={t('inntektenDin.naeringsinntekt.arbeidsinntektIAar.tilDoedsfall')}
                        description={t('inntektenDin.naeringsinntekt.arbeidsinntektIAar.tilDoedsfall.beskrivelse')}
                        htmlSize={Bredde.S}
                    />
                    <BodyShort className="currency">{t('felles.kroner')}</BodyShort>
                </InputWithCurrency>
            </SkjemaElement>
            <SkjemaElement>
                <InputWithCurrency $hasError={!!errors.naeringsinntekt?.arbeidsinntektIAar?.etterDoedsfall}>
                    <RHFValutaInput
                        name={'naeringsinntekt.arbeidsinntektIAar.etterDoedsfall'}
                        label={t('inntektenDin.naeringsinntekt.arbeidsinntektIAar.etterDoedsfall')}
                        description={t('inntektenDin.naeringsinntekt.arbeidsinntektIAar.etterDoedsfall.beskrivelse')}
                        htmlSize={Bredde.S}
                    />
                    <BodyShort className="currency">{t('felles.kroner')}</BodyShort>
                </InputWithCurrency>
            </SkjemaElement>

            <Alert variant={'info'}>{t('inntektenDin.naeringsinntekt.info')}</Alert>
        </SkjemaGruppe>
    )
}

export default Naeringsinntekt
