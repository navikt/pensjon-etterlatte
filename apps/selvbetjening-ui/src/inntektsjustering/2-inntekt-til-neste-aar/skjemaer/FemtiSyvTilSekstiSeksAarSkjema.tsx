import { useInntekt, useInntektDispatch } from '../../../common/inntekt/InntektContext.tsx'
import { useForm } from 'react-hook-form'
import { Inntekt, SkalGaaAvMedAlderspensjon } from '../../../types/inntektsjustering.ts'
import { Radio, ReadMore, TextField, VStack } from '@navikt/ds-react'
import { useSanityInnhold } from '../../../common/sanity/useSanityInnhold.ts'
import { InntektsjusteringInntektTilNesteAar as InntektsjusteringInntektTilNesteAarInnhold } from '../../../sanity.types.ts'
import { Navigate, useNavigate } from 'react-router-dom'
import { useSpraak } from '../../../common/spraak/SpraakContext.tsx'
import { SanityRikTekst } from '../../../common/sanity/SanityRikTekst.tsx'
import { SumAvOppgittInntekt } from '../SumAvOppgittInntekt.tsx'
import { NavigasjonMeny } from '../../../common/NavigasjonMeny/NavigasjonMeny.tsx'
import { ControlledInntektTextField } from '../../../common/inntekt/ControlledInntektTextField.tsx'
import { Alder } from '../../../types/person.ts'
import { ControlledRadioGruppe } from '../../../common/radio/ControlledRadioGruppe.tsx'
import { ControlledMaanedVelger } from '../../../common/maanedVelger/ControlledMaanedVelger.tsx'

export const FemtiSyvTilSekstiSeksAarSkjema = () => {
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

    if ((innholdError && !innholdIsLoading) || !innhold?.inntektSkjemaer?.femtiSyvTilSekstiAarSkjema) {
        return <Navigate to="/system-utilgjengelig" />
    }

    const onInntektSubmit = (inntekt: Inntekt) => {
        inntektDispatch.setInntekt(inntekt)
        navigate(`/inntektsjustering/oppsummering`)
    }

    const { arbeidsinntekt, naeringsinntekt, AFPInntekt, AFPTjenestepensjonordning, inntektFraUtland } =
        innhold.inntektSkjemaer.femtiSyvTilSekstiAarSkjema

    // TODO: Hvis person har valg enten 'NEI' eller 'VET_IKKE' så må vi resette dataen til dato
    return (
        !!innhold && (
            <form>
                <VStack gap="6" width="fit-content">
                    <VStack gap="2">
                        <ControlledRadioGruppe
                            name="skalGaaAvMedAlderspensjon"
                            control={control}
                            legend="Skal du gå av med alderspensjon til neste år?"
                            errorVedTomInput="Du må velge om du skal gå av med alderspensjon til neste år"
                            radios={
                                <>
                                    <Radio value={SkalGaaAvMedAlderspensjon.JA}>Ja</Radio>
                                    <Radio value={SkalGaaAvMedAlderspensjon.NEI}>Nei</Radio>
                                    <Radio value={SkalGaaAvMedAlderspensjon.VET_IKKE}>Vet ikke</Radio>
                                </>
                            }
                        />
                        <ReadMore header="Når kan jeg ta ut alderspensjon?">
                            Du kan ta ut alderspensjon fra måneden etter at du fyller 67 år.
                        </ReadMore>
                    </VStack>
                    {watch().skalGaaAvMedAlderspensjon === SkalGaaAvMedAlderspensjon.JA && (
                        <VStack gap="2">
                            <ControlledMaanedVelger
                                name="datoForAaGaaAvMedAlderspensjon"
                                control={control}
                                label="Når planlegger du å gå av med alderpensjon?"
                                errorVedTomInput="Du må velge"
                            />
                        </VStack>
                    )}
                    <div>
                        <SanityRikTekst text={[]} />
                        <ReadMore header="Grunnen til at vi spør om dette">Fordi vi vil, duhh</ReadMore>
                    </div>

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
                        name="AFPInntekt"
                        control={control}
                        label={AFPInntekt?.label?.[spraak]}
                        description={AFPInntekt?.description?.[spraak]}
                    />

                    {!!watch().AFPInntekt && (
                        <TextField
                            {...register('AFPTjenesteordning', {
                                required: {
                                    value: true,
                                    message: AFPTjenestepensjonordning?.tomInputError?.[spraak] ?? 'Må settes',
                                },
                            })}
                            label={AFPTjenestepensjonordning?.label?.[spraak]}
                            description={AFPTjenestepensjonordning?.description?.[spraak]}
                            error={errors.AFPTjenesteordning?.message}
                        />
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

                    <SumAvOppgittInntekt inntektTilNesteAar={watch()} alder={Alder.FEMTI_SYV_TIL_SEKSTI_SEKS} />

                    <NavigasjonMeny tilbakePath="/innledning" onNeste={handleSubmit(onInntektSubmit)} />
                </VStack>
            </form>
        )
    )
}
