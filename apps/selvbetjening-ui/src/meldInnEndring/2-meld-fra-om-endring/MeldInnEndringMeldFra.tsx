import { useForm } from 'react-hook-form'
import { Endring, MeldtInnEndring } from '../../types/meldInnEndring.ts'
import { HStack, Radio, Textarea, VStack } from '@navikt/ds-react'
import { ControlledRadioGruppe } from '../../common/radioGruppe/ControlledRadioGruppe.tsx'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { MeldInnEndringMeldFra as MeldInnEndringMeldFraInnhold } from '../sanity.types.ts'
import { SideLaster } from '../../common/SideLaster.tsx'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { InformasjonOmAktivitetOgInntekt } from './InformasjonOmAktivitetOgInntekt.tsx'
import { InformasjonOmInntekt } from './InformasjonOmInntekt.tsx'
import { InformasjonOmAnnet } from './InformasjonOmAnnet.tsx'
import { NavigasjonMeny } from '../../common/navigasjonMeny/NavigasjonMeny.tsx'
import { useNavigate } from 'react-router-dom'
import {
    useMeldInnEndring,
    useMeldInnEndringDispatch,
} from '../components/meldInnEndringContext/MeldInnEndringContext.tsx'
import { SammendragAvSkjemaFeil } from '../../common/sammendragAvSkjemaFeil/SammendragAvSkjemaFeil.tsx'

export const MeldInnEndringMeldFra = () => {
    const spraak = useSpraak()

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
                                            })}
                                            label={innhold.beskrivelseAvEndring?.label?.[spraak]}
                                            description={innhold.beskrivelseAvEndring?.description?.[spraak]}
                                            error={errors?.beskrivelse?.message}
                                        />
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
