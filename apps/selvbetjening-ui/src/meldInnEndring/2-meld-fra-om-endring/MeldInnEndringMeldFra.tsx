import { Alert, HStack, Radio, Textarea, VStack } from '@navikt/ds-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { SideLaster } from '../../common/SideLaster.tsx'
import {
    FeatureToggleNavn,
    FeatureToggleStatus,
    useFeatureToggle,
} from '../../common/featureToggles/FeatureTogglesContext.tsx'
import { NavigasjonMeny } from '../../common/navigasjonMeny/NavigasjonMeny.tsx'
import { ControlledRadioGruppe } from '../../common/radioGruppe/ControlledRadioGruppe.tsx'
import { SammendragAvSkjemaFeil } from '../../common/sammendragAvSkjemaFeil/SammendragAvSkjemaFeil.tsx'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { Endring, MeldtInnEndring } from '../../types/meldInnEndring.ts'
import {
    useMeldInnEndring,
    useMeldInnEndringDispatch,
} from '../components/meldInnEndringContext/MeldInnEndringContext.tsx'
import { MeldInnEndringMeldFra as MeldInnEndringMeldFraInnhold } from '../sanity.types.ts'
import { InformasjonOmAktivitetOgInntekt } from './InformasjonOmAktivitetOgInntekt.tsx'
import { InformasjonOmAnnet } from './InformasjonOmAnnet.tsx'
import { InformasjonOmInntekt } from './InformasjonOmInntekt.tsx'

const MAKS_ANTALL_TEGN_I_BESKRIVELSE_AV_ENDRING: number = 2000

export const MeldInnEndringMeldFra = () => {
    const spraak = useSpraak()

    const etteroppgjoerFeatureToggle = useFeatureToggle(FeatureToggleNavn.ETTEROPPGJOER)

    const meldInnEndring = useMeldInnEndring()
    const meldInnEndringDispatch = useMeldInnEndringDispatch()

    const navigate = useNavigate()

    const {
        register,
        control,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<MeldtInnEndring>({ defaultValues: meldInnEndring })

    const { innhold, error, isLoading } = useSanityInnhold<MeldInnEndringMeldFraInnhold>(
        '*[_type == "meldInnEndringMeldFra"]'
    )

    if (isLoading) {
        return <SideLaster />
    }

    if (error) {
        throw error
    }

    const onMeldInnInntektSubmit = (meldInnEndring: MeldtInnEndring) => {
        meldInnEndringDispatch.setMeldInnEndring(meldInnEndring)
        navigate('/meld-inn-endring/oppsummering')
    }

    const velgVisningAvInformasjonForEndring = (endring?: Endring) => {
        switch (endring) {
            case Endring.AKTIVITET_OG_INNTEKT:
                return <InformasjonOmAktivitetOgInntekt />
            case Endring.INNTEKT:
                return <InformasjonOmInntekt />
            case Endring.SVAR_PAA_ETTEROPPGJOER:
                return (
                    <SanityRikTekst
                        text={innhold?.informasjonOmEndring?.svarPaaEtteroppgjoer?.hovedinnhold?.[spraak]}
                    />
                )
            case Endring.ANNET:
                return <InformasjonOmAnnet />
            default:
                return <></>
        }
    }

    return (
        !!innhold && (
            <main>
                <HStack justify="center" padding="8" minHeight="100vh">
                    <VStack gap="6" maxWidth="36rem">
                        <SkjemaHeader aktivtSteg={2} stegLabelKey="steg2" skjemaNavn="meld-inn-endring" />
                        <form>
                            <VStack gap="6" width="fit-content">
                                <ControlledRadioGruppe
                                    name="endring"
                                    control={control}
                                    legend={innhold.endring?.legend?.[spraak]}
                                    description={innhold.endring?.description?.[spraak]}
                                    errorVedTomInput={innhold.endring?.errorVedTomInput?.[spraak]}
                                    radios={
                                        <>
                                            <Radio
                                                value={Endring.AKTIVITET_OG_INNTEKT}
                                                description={
                                                    innhold.endring?.radios?.aktivitetOgInntekt?.description?.[spraak]
                                                }
                                            >
                                                {innhold.endring?.radios?.aktivitetOgInntekt?.label?.[spraak]}
                                            </Radio>
                                            <Radio value={Endring.INNTEKT}>
                                                {innhold.endring?.radios?.inntekt?.label?.[spraak]}
                                            </Radio>
                                            {etteroppgjoerFeatureToggle.status === FeatureToggleStatus.PAA && (
                                                <Radio value={Endring.SVAR_PAA_ETTEROPPGJOER}>
                                                    {innhold.endring?.radios?.svarPaaEtteroppgjoer?.label?.[spraak]}
                                                </Radio>
                                            )}
                                            <Radio value={Endring.ANNET}>
                                                {innhold.endring?.radios?.annet?.label?.[spraak]}
                                            </Radio>
                                        </>
                                    }
                                />

                                {!!watch('endring') && (
                                    <>
                                        {velgVisningAvInformasjonForEndring(watch('endring'))}

                                        <Textarea
                                            {...register('beskrivelse', {
                                                required: {
                                                    value: true,
                                                    message:
                                                        innhold.beskrivelseAvEndring?.errorVedTomInput?.[spraak] ?? '',
                                                },
                                                maxLength: {
                                                    value: MAKS_ANTALL_TEGN_I_BESKRIVELSE_AV_ENDRING,
                                                    message:
                                                        innhold.beskrivelseAvEndring?.errorVedForMangeTegn?.[spraak] ??
                                                        '',
                                                },
                                            })}
                                            label={
                                                watch('endring') === Endring.SVAR_PAA_ETTEROPPGJOER
                                                    ? innhold.beskrivelseAvEndring?.svarPaaEtteroppgjoerLabel?.[spraak]
                                                    : innhold.beskrivelseAvEndring?.label?.[spraak]
                                            }
                                            description={
                                                watch('endring') === Endring.SVAR_PAA_ETTEROPPGJOER
                                                    ? innhold.beskrivelseAvEndring?.svarPaaEtteroppgjoerDescription?.[
                                                          spraak
                                                      ]
                                                    : innhold.beskrivelseAvEndring?.description?.[spraak]
                                            }
                                            maxLength={MAKS_ANTALL_TEGN_I_BESKRIVELSE_AV_ENDRING}
                                            i18n={{
                                                counterLeft: innhold.beskrivelseAvEndring?.tegnIgjen?.[spraak],
                                                counterTooMuch: innhold.beskrivelseAvEndring?.forMangeTegn?.[spraak],
                                            }}
                                            error={errors?.beskrivelse?.message}
                                        />

                                        {watch('endring') === Endring.SVAR_PAA_ETTEROPPGJOER && (
                                            <Alert variant="info">
                                                {innhold.svarPaaEtteroppgjoerDokumentasjonInfoAlert?.[spraak]}
                                            </Alert>
                                        )}
                                    </>
                                )}

                                <SammendragAvSkjemaFeil errors={errors} />

                                <NavigasjonMeny
                                    tilbakePath="/meld-inn-endring/innledning"
                                    onNeste={handleSubmit(onMeldInnInntektSubmit)}
                                />
                            </VStack>
                        </form>
                    </VStack>
                </HStack>
            </main>
        )
    )
}
