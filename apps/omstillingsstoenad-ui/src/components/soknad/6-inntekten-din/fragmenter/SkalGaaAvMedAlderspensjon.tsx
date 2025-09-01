import { BodyShort, Link, RadioProps, ReadMore, VStack } from '@navikt/ds-react'
import { addYears, endOfYear, startOfYear } from 'date-fns'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Maanedvelger } from '~components/felles/Maanedvelger'
import { RHFRadio } from '~components/felles/rhf/RHFRadio'
import { useBrukerContext } from '~context/bruker/BrukerContext'
import { IInntekt, SkalGaaAvMedAlderspensjonValg } from '~typer/inntekt'
import { fyllerSekstiSyvIAar } from '~utils/alder'
import { erMellomOktoberogDesember } from '~utils/dato'

export const SkalGaaAvMedAlderspensjon = () => {
    const { t } = useTranslation()

    const { state: bruker } = useBrukerContext()

    const { watch } = useFormContext<IInntekt>()

    const velgLegendTekstForSkalGaaAvMedAlderspensjon = (): string => {
        if (fyllerSekstiSyvIAar(bruker)) {
            return t('inntektenDin.skalGaaAvMedAlderspensjon.valg.fyllerSekstiSyvIAar')
        } else if (erMellomOktoberogDesember()) {
            return t('inntektenDin.skalGaaAvMedAlderspensjon.valg.forventetInntektTilNesteAar')
        } else {
            return t('inntektenDin.skalGaaAvMedAlderspensjon.valg.forventetInntektIAar')
        }
    }

    const skalGaAavMedAlderspensjon = watch('skalGaaAvMedAlderspensjon')

    return (
        <VStack gap="4">
            <VStack gap="2">
                <RHFRadio
                    name={'skalGaaAvMedAlderspensjon.valg'}
                    legend={velgLegendTekstForSkalGaaAvMedAlderspensjon()}
                >
                    {Object.values(SkalGaaAvMedAlderspensjonValg).map((value) => {
                        return { children: t(value), value } as RadioProps
                    })}
                </RHFRadio>

                <ReadMore header={t('inntektenDin.skalGaaAvMedAlderspensjon.naarKanJegTaUtAlderspensjon.tittel')}>
                    {t('inntektenDin.skalGaaAvMedAlderspensjon.naarKanJegTaUtAlderspensjon.innhold')}
                </ReadMore>

                <ReadMore header={t('inntektenDin.alderspensjonOgOmstillingsstoenad.tittel')}>
                    <VStack gap="4">
                        <BodyShort>{t('inntektenDin.alderspensjonOgOmstillingsstoenad.p1')}</BodyShort>
                        <BodyShort>
                            {t('inntektenDin.alderspensjonOgOmstillingsstoenad.p2')}{' '}
                            <Link href={t('inntektenDin.alderspensjonOgOmstillingsstoenad.p2.lenke.href')}>
                                {t('inntektenDin.alderspensjonOgOmstillingsstoenad.p2.lenke.tekst')}
                            </Link>
                        </BodyShort>
                        <BodyShort>
                            {t('inntektenDin.alderspensjonOgOmstillingsstoenad.p3')}{' '}
                            <Link href={t('inntektenDin.alderspensjonOgOmstillingsstoenad.p3.lenke.href')}>
                                {t('inntektenDin.alderspensjonOgOmstillingsstoenad.p3.lenke.tekst')}
                            </Link>
                        </BodyShort>
                        <BodyShort>{t('inntektenDin.alderspensjonOgOmstillingsstoenad.p4')}</BodyShort>
                    </VStack>
                </ReadMore>
            </VStack>

            {skalGaAavMedAlderspensjon?.valg === SkalGaaAvMedAlderspensjonValg.JA && (
                <Maanedvelger
                    name={'skalGaaAvMedAlderspensjon.datoForAaGaaAvMedAlderspensjon'}
                    label={t('inntektenDin.skalGaaAvMedAlderspensjon.datoForAaGaaAvMedAlderspensjon')}
                    fromDate={
                        erMellomOktoberogDesember()
                            ? new Date(addYears(new Date(startOfYear(new Date())), 1))
                            : new Date(startOfYear(new Date()))
                    }
                />
            )}

            {skalGaAavMedAlderspensjon?.valg === SkalGaaAvMedAlderspensjonValg.TAR_ALLEREDE_UT_ALDERSPENSJON && (
                <Maanedvelger
                    name={'skalGaaAvMedAlderspensjon.datoForAaGaaAvMedAlderspensjon'}
                    label={t(
                        'inntektenDin.skalGaaAvMedAlderspensjon.datoForAaGaaAvMedAlderspensjon.tarAlleredeUtAlderspensjon'
                    )}
                    toDate={endOfYear(new Date())}
                />
            )}
        </VStack>
    )
}
