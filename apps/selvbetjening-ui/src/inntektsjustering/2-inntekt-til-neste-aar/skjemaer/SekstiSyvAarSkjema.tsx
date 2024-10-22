import { useSpraak } from '../../../common/spraak/SpraakContext.tsx'
import { useInntekt, useInntektDispatch } from '../../../common/inntekt/InntektContext.tsx'
import { Navigate, useNavigate } from 'react-router-dom'
import { useSanityInnhold } from '../../../common/sanity/useSanityInnhold.ts'
import { InntektsjusteringInntektTilNesteAar as InntektsjusteringInntektTilNesteAarInnhold } from '../../../sanity.types.ts'
import { useForm } from 'react-hook-form'
import { Inntekt, SkalGaaAvMedAlderspensjon } from '../../../types/inntektsjustering.ts'
import { Box, ErrorSummary, Loader, Radio, ReadMore, TextField, VStack } from '@navikt/ds-react'
import { SanityRikTekst } from '../../../common/sanity/SanityRikTekst.tsx'
import { ControlledRadioGruppe } from '../../../common/radio/ControlledRadioGruppe.tsx'
import { ControlledMaanedVelger } from '../../../common/maanedVelger/ControlledMaanedVelger.tsx'
import { ControlledInntektTextField } from '../../../common/inntekt/ControlledInntektTextField.tsx'
import { SumAvOppgittInntekt } from '../SumAvOppgittInntekt.tsx'
import { Alder } from '../../../types/person.ts'
import { NavigasjonMeny } from '../../../common/NavigasjonMeny/NavigasjonMeny.tsx'
import { formaterFieldErrors } from '../../../utils/error.ts'

export const SekstiSyvAarSkjema = () => {
    const spraak = useSpraak()

    const inntekt = useInntekt()
    const inntektDispatch = useInntektDispatch()

    const navigate = useNavigate()

    const {
        innhold,
        error: innholdError,
        isLoading: innholdIsLoading,
    } = useSanityInnhold<InntektsjusteringInntektTilNesteAarInnhold>(
        '*[_type == "inntektsjusteringInntektTilNesteAar"]'
    )

    const {
        register,
        control,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<Inntekt>({ defaultValues: inntekt })

    if (innholdIsLoading) {
        return <Loader />
    }
    if (innholdError) {
        return <Navigate to="/system-utilgjengelig" />
    }
    if (!innhold?.inntektSkjemaer?.sekstiSyvAarSkjema) {
        return <Navigate to="/system-utilgjengelig" />
    }

    const onInntektSubmit = (inntekt: Inntekt) => {
        inntektDispatch.setInntekt(inntekt)
        navigate(`/oppsummering`)
    }

    const {
        hovedinnhold,
        skalGaaAvMedAlderspensjon,
        datoForAaGaaAvMedAlderspensjon,
        inntekterSomSkalMeldesInn,
        arbeidsinntekt,
        naeringsinntekt,
        AFPInntekt,
        AFPTjenestepensjonordning,
        inntektFraUtland,
        sumAvInntekt,
    } = innhold.inntektSkjemaer.sekstiSyvAarSkjema

    const nesteAar = new Date().getFullYear() + 1
    const foersteDagNesteAar = new Date(nesteAar, 0, 1)
    const sisteDagNesteAar = new Date(nesteAar, 11, 31)

    return (
        !!innhold && (
            <form>
                <VStack gap="6" width="fit-content">
                    <div>
                        <SanityRikTekst text={hovedinnhold?.[spraak]} />
                    </div>

                    <VStack gap="2">
                        <ControlledRadioGruppe
                            name="skalGaaAvMedAlderspensjon"
                            control={control}
                            legend={skalGaaAvMedAlderspensjon?.legend?.[spraak]}
                            description={skalGaaAvMedAlderspensjon?.description?.[spraak]}
                            errorVedTomInput={skalGaaAvMedAlderspensjon?.errorVedTomInput?.[spraak]}
                            radios={
                                <>
                                    <Radio value={SkalGaaAvMedAlderspensjon.JA}>
                                        {skalGaaAvMedAlderspensjon?.radios?.ja?.[spraak]}
                                    </Radio>
                                    <Radio value={SkalGaaAvMedAlderspensjon.NEI}>
                                        {skalGaaAvMedAlderspensjon?.radios?.nei?.[spraak]}
                                    </Radio>
                                    <Radio value={SkalGaaAvMedAlderspensjon.VET_IKKE}>
                                        {skalGaaAvMedAlderspensjon?.radios?.vetIkke?.[spraak]}
                                    </Radio>
                                </>
                            }
                        />
                        {!!skalGaaAvMedAlderspensjon?.readMore && (
                            <ReadMore header={skalGaaAvMedAlderspensjon.readMore?.tittel?.[spraak]}>
                                <SanityRikTekst text={skalGaaAvMedAlderspensjon.readMore?.innhold?.[spraak]} />
                            </ReadMore>
                        )}
                    </VStack>
                    {watch('skalGaaAvMedAlderspensjon') !== undefined && (
                        <>
                            {watch('skalGaaAvMedAlderspensjon') === SkalGaaAvMedAlderspensjon.JA && (
                                <>
                                    <VStack gap="2">
                                        <ControlledMaanedVelger
                                            name="datoForAaGaaAvMedAlderspensjon"
                                            control={control}
                                            label={datoForAaGaaAvMedAlderspensjon?.label?.[spraak]}
                                            description={datoForAaGaaAvMedAlderspensjon?.description?.[spraak]}
                                            errorVedTomInput={
                                                datoForAaGaaAvMedAlderspensjon?.errorVedTomInput?.[spraak]
                                            }
                                            fromDate={foersteDagNesteAar}
                                            toDate={sisteDagNesteAar}
                                        />
                                        {!!datoForAaGaaAvMedAlderspensjon?.readMore && (
                                            <ReadMore header={datoForAaGaaAvMedAlderspensjon.readMore.tittel?.[spraak]}>
                                                <SanityRikTekst
                                                    text={datoForAaGaaAvMedAlderspensjon.readMore.innhold?.[spraak]}
                                                />
                                            </ReadMore>
                                        )}
                                    </VStack>
                                </>
                            )}
                            <VStack gap="2">
                                <SanityRikTekst text={inntekterSomSkalMeldesInn?.[spraak]} />
                            </VStack>

                            <VStack gap="2">
                                <ControlledInntektTextField
                                    name="arbeidsinntekt"
                                    control={control}
                                    label={arbeidsinntekt?.label?.[spraak]}
                                    description={arbeidsinntekt?.description?.[spraak]}
                                />

                                {!!arbeidsinntekt?.readMore && (
                                    <ReadMore header={arbeidsinntekt?.readMore?.tittel?.[spraak]}>
                                        <SanityRikTekst text={arbeidsinntekt?.readMore?.innhold?.[spraak]} />
                                    </ReadMore>
                                )}
                            </VStack>

                            <VStack gap="2">
                                <ControlledInntektTextField
                                    name="naeringsinntekt"
                                    control={control}
                                    label={naeringsinntekt?.label?.[spraak]}
                                    description={naeringsinntekt?.description?.[spraak]}
                                />
                                {!!naeringsinntekt?.readMore && (
                                    <ReadMore header={naeringsinntekt?.readMore?.tittel?.[spraak]}>
                                        <SanityRikTekst text={naeringsinntekt?.readMore?.innhold?.[spraak]} />
                                    </ReadMore>
                                )}
                            </VStack>

                            <ControlledInntektTextField
                                name="afpInntekt"
                                control={control}
                                label={AFPInntekt?.label?.[spraak]}
                                description={AFPInntekt?.description?.[spraak]}
                            />

                            {!!watch('afpInntekt') && (
                                <Box maxWidth="25rem">
                                    <TextField
                                        {...register('afpTjenesteordning', {
                                            required: {
                                                value: true,
                                                message:
                                                    AFPTjenestepensjonordning?.errorVedTomInput?.[spraak] ??
                                                    'Må settes',
                                            },
                                        })}
                                        label={AFPTjenestepensjonordning?.label?.[spraak]}
                                        description={AFPTjenestepensjonordning?.description?.[spraak]}
                                        error={errors.afpTjenesteordning?.message}
                                    />
                                </Box>
                            )}

                            <VStack gap="2">
                                <ControlledInntektTextField
                                    name="inntektFraUtland"
                                    control={control}
                                    label={inntektFraUtland?.label?.[spraak]}
                                    description={inntektFraUtland?.description?.[spraak]}
                                />

                                {!!inntektFraUtland?.readMore && (
                                    <ReadMore header={inntektFraUtland?.readMore?.tittel?.[spraak]}>
                                        <SanityRikTekst text={inntektFraUtland?.readMore?.innhold?.[spraak]} />
                                    </ReadMore>
                                )}
                            </VStack>

                            <SumAvOppgittInntekt inntektTilNesteAar={watch()} alder={Alder.FEMTI_SYV_TIL_SEKSTI_SEKS}>
                                {watch('skalGaaAvMedAlderspensjon') === SkalGaaAvMedAlderspensjon.JA ? (
                                    <SanityRikTekst text={sumAvInntekt?.skalGaaAvMedAlderspensjon?.ja?.[spraak]} />
                                ) : (
                                    <SanityRikTekst
                                        text={sumAvInntekt?.skalGaaAvMedAlderspensjon?.neiVetIkke?.[spraak]}
                                    />
                                )}
                            </SumAvOppgittInntekt>
                        </>
                    )}

                    {!!Object.keys(errors)?.length && (
                        <ErrorSummary heading="Du må fikse disse feilene">
                            {formaterFieldErrors(errors).map((error) => (
                                <ErrorSummary.Item key={error.name} href={`#${error.name}`}>
                                    {error.message}
                                </ErrorSummary.Item>
                            ))}
                        </ErrorSummary>
                    )}

                    <NavigasjonMeny tilbakePath="/innledning" onNeste={handleSubmit(onInntektSubmit)} />
                </VStack>
            </form>
        )
    )
}
