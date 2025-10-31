import { Alert, HStack, Radio, Textarea, VStack } from '@navikt/ds-react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { erMellomOktoberogDesember } from '../../common/dato.ts'
import {
    FeatureToggleNavn,
    FeatureToggleStatus,
    useFeatureToggle,
} from '../../common/featureToggles/FeatureTogglesContext.tsx'
import { NavigasjonMeny } from '../../common/navigasjonMeny/NavigasjonMeny.tsx'
import { ControlledRadioGruppe } from '../../common/radioGruppe/ControlledRadioGruppe.tsx'
import { SideLaster } from '../../common/SideLaster.tsx'
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
import { ForventetInntektTIlNesteAar } from './forventetInntektTilNesteAar/ForventetInntektTIlNesteAar.tsx'
import { InformasjonOmAktivitetOgInntekt } from './InformasjonOmAktivitetOgInntekt.tsx'
import { InformasjonOmAnnet } from './InformasjonOmAnnet.tsx'
import { InformasjonOmInntekt } from './InformasjonOmInntekt.tsx'

const MAKS_ANTALL_TEGN_I_BESKRIVELSE_AV_ENDRING: number = 2000

export const MeldInnEndringMeldFra = () => {
    const spraak = useSpraak()

    const etteroppgjoerFeatureToggle = useFeatureToggle(FeatureToggleNavn.ETTEROPPGJOER)
    const migrerInntektSKjemaFeatureToggle = useFeatureToggle(
        FeatureToggleNavn.MIGRER_INNTEKT_SKJEMA_TIL_MELD_INN_ENDRING_SKJEMA
    )

    const meldInnEndring = useMeldInnEndring()
    const meldInnEndringDispatch = useMeldInnEndringDispatch()

    const navigate = useNavigate()

    const methods = useForm<MeldtInnEndring>({ defaultValues: meldInnEndring })

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
            case Endring.FORVENTET_INNTEKT_TIL_NESTE_AAR:
                return (
                    <SanityRikTekst
                        text={innhold?.informasjonOmEndring?.forventetInntektTilNesteAar?.hovedinnhold?.[spraak]}
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
                        <FormProvider {...methods}>
                            <VStack gap="6" width="fit-content">
                                <ControlledRadioGruppe
                                    name="endring"
                                    control={methods.control}
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
                                            {erMellomOktoberogDesember() &&
                                                migrerInntektSKjemaFeatureToggle.status === FeatureToggleStatus.PAA && (
                                                    <Radio value={Endring.FORVENTET_INNTEKT_TIL_NESTE_AAR}>
                                                        {
                                                            innhold.endring?.radios?.forventetInntektTilNesteAar
                                                                ?.label?.[spraak]
                                                        }
                                                    </Radio>
                                                )}
                                            <Radio value={Endring.ANNET}>
                                                {innhold.endring?.radios?.annet?.label?.[spraak]}
                                            </Radio>
                                        </>
                                    }
                                />

                                {!!methods.watch('endring') && (
                                    <>
                                        {velgVisningAvInformasjonForEndring(methods.watch('endring'))}

                                        {methods.watch('endring') === Endring.FORVENTET_INNTEKT_TIL_NESTE_AAR ? (
                                            <ForventetInntektTIlNesteAar />
                                        ) : (
                                            <Textarea
                                                {...methods.register('beskrivelse', {
                                                    required: {
                                                        value: true,
                                                        message:
                                                            innhold.beskrivelseAvEndring?.errorVedTomInput?.[spraak] ??
                                                            '',
                                                    },
                                                    maxLength: {
                                                        value: MAKS_ANTALL_TEGN_I_BESKRIVELSE_AV_ENDRING,
                                                        message:
                                                            innhold.beskrivelseAvEndring?.errorVedForMangeTegn?.[
                                                                spraak
                                                            ] ?? '',
                                                    },
                                                })}
                                                label={
                                                    methods.watch('endring') === Endring.SVAR_PAA_ETTEROPPGJOER
                                                        ? innhold.beskrivelseAvEndring?.svarPaaEtteroppgjoerLabel?.[
                                                              spraak
                                                          ]
                                                        : innhold.beskrivelseAvEndring?.label?.[spraak]
                                                }
                                                description={
                                                    methods.watch('endring') === Endring.SVAR_PAA_ETTEROPPGJOER
                                                        ? innhold.beskrivelseAvEndring
                                                              ?.svarPaaEtteroppgjoerDescription?.[spraak]
                                                        : innhold.beskrivelseAvEndring?.description?.[spraak]
                                                }
                                                maxLength={MAKS_ANTALL_TEGN_I_BESKRIVELSE_AV_ENDRING}
                                                i18n={{
                                                    counterLeft: innhold.beskrivelseAvEndring?.tegnIgjen?.[spraak],
                                                    counterTooMuch:
                                                        innhold.beskrivelseAvEndring?.forMangeTegn?.[spraak],
                                                }}
                                                error={methods.formState.errors?.beskrivelse?.message}
                                            />
                                        )}

                                        {methods.watch('endring') === Endring.SVAR_PAA_ETTEROPPGJOER && (
                                            <Alert variant="info">
                                                {innhold.svarPaaEtteroppgjoerDokumentasjonInfoAlert?.[spraak]}
                                            </Alert>
                                        )}
                                    </>
                                )}

                                <SammendragAvSkjemaFeil errors={methods.formState.errors} />

                                <NavigasjonMeny
                                    tilbakePath="/meld-inn-endring/innledning"
                                    onNeste={methods.handleSubmit(onMeldInnInntektSubmit)}
                                />
                            </VStack>
                        </FormProvider>
                    </VStack>
                </HStack>
            </main>
        )
    )
}
