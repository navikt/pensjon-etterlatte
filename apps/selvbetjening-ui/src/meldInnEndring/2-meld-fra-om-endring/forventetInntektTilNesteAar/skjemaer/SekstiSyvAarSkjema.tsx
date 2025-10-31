import { Box, Radio, ReadMore, TextField, VStack } from '@navikt/ds-react'
import { useFormContext } from 'react-hook-form'
import { KomponentLaster } from '../../../../common/KomponentLaster.tsx'
import { ControlledMaanedVelger } from '../../../../common/maanedVelger/ControlledMaanedVelger.tsx'
import { ControlledRadioGruppe } from '../../../../common/radioGruppe/ControlledRadioGruppe.tsx'
import { SanityRikTekst } from '../../../../common/sanity/SanityRikTekst.tsx'
import { useSanityInnhold } from '../../../../common/sanity/useSanityInnhold.ts'
import { useSpraak } from '../../../../common/spraak/SpraakContext.tsx'
import { ControlledInntektTextField } from '../../../../inntektsjustering/components/controlledInntektTextField/ControlledInntektTextField.tsx'
import { Alder, MeldtInnEndring, SkalGaaAvMedAlderspensjon } from '../../../../types/meldInnEndring.ts'
import { MeldInnEndringMeldFra } from '../../../sanity.types.ts'
import { SumAvOppgittInntekt } from './SumAvOppgittInntekt.tsx'
import { forventetInntektTilNesteAarSkjemaValuesTilValues } from './utils.ts'

export const SekstiSyvAarSkjema = () => {
    const spraak = useSpraak()

    const { innhold, error, isLoading } = useSanityInnhold<MeldInnEndringMeldFra>('*[_type == "meldInnEndringMeldFra"]')

    const {
        control,
        register,
        watch,
        formState: { errors },
    } = useFormContext<MeldtInnEndring>()

    if (isLoading) {
        return <KomponentLaster />
    }
    if (error) {
        throw error
    }
    if (!innhold?.forventetInntektTilNesteAarSkjemer?.sekstiSyvAarSkjema) {
        throw Error('Finner ikke sanity innhold for skjema 67 år')
    }

    const nesteAar = new Date().getFullYear() + 1
    const foersteDagNesteAar = new Date(nesteAar, 0, 1)
    const sisteDagNesteAar = new Date(nesteAar, 11, 31)

    const {
        skalGaaAvMedAlderspensjon,
        datoForAaGaaAvMedAlderspensjon,
        inntekterSomSkalMeldesInn,
        arbeidsinntekt,
        naeringsinntekt,
        afpInntekt,
        afpTjenestepensjonordning,
        inntektFraUtland,
        sumAvInntekt,
    } = innhold.forventetInntektTilNesteAarSkjemer.sekstiSyvAarSkjema

    return (
        !!innhold && (
            <>
                <VStack gap="2">
                    <ControlledRadioGruppe
                        name="forventetInntektTilNesteAar.skalGaaAvMedAlderspensjon"
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
                {watch('forventetInntektTilNesteAar.skalGaaAvMedAlderspensjon') !== undefined && (
                    <>
                        {watch('forventetInntektTilNesteAar.skalGaaAvMedAlderspensjon') ===
                            SkalGaaAvMedAlderspensjon.JA && (
                            <VStack gap="2">
                                <ControlledMaanedVelger
                                    name="forventetInntektTilNesteAar.datoForAaGaaAvMedAlderspensjon"
                                    control={control}
                                    label={datoForAaGaaAvMedAlderspensjon?.label?.[spraak]}
                                    description={datoForAaGaaAvMedAlderspensjon?.description?.[spraak]}
                                    errorVedTomInput={datoForAaGaaAvMedAlderspensjon?.errorVedTomInput?.[spraak]}
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
                        )}

                        <VStack gap="2">
                            <SanityRikTekst text={inntekterSomSkalMeldesInn?.[spraak]} />
                        </VStack>

                        <VStack gap="2">
                            <ControlledInntektTextField
                                name="forventetInntektTilNesteAar.arbeidsinntekt"
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
                                name="forventetInntektTilNesteAar.naeringsinntekt"
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
                            name="forventetInntektTilNesteAar.afpInntekt"
                            control={control}
                            label={afpInntekt?.label?.[spraak]}
                            description={afpInntekt?.description?.[spraak]}
                        />

                        {!!watch('forventetInntektTilNesteAar.afpInntekt') &&
                            watch('forventetInntektTilNesteAar.afpInntekt') !== '0' && (
                                <Box maxWidth="25rem">
                                    <TextField
                                        {...register('forventetInntektTilNesteAar.afpTjenesteordning', {
                                            required: {
                                                value: true,
                                                message:
                                                    afpTjenestepensjonordning?.errorVedTomInput?.[spraak] ??
                                                    'Må settes',
                                            },
                                        })}
                                        label={afpTjenestepensjonordning?.label?.[spraak]}
                                        description={afpTjenestepensjonordning?.description?.[spraak]}
                                        error={errors.forventetInntektTilNesteAar?.afpTjenesteordning?.message}
                                    />
                                </Box>
                            )}

                        <VStack gap="2">
                            <ControlledInntektTextField
                                name="forventetInntektTilNesteAar.inntektFraUtland"
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

                        <SumAvOppgittInntekt
                            forventetInntektTilNesteAar={forventetInntektTilNesteAarSkjemaValuesTilValues(
                                watch('forventetInntektTilNesteAar')!
                            )}
                            alder={Alder.SEKSTI_SYV}
                        >
                            {watch('forventetInntektTilNesteAar.skalGaaAvMedAlderspensjon') ===
                            SkalGaaAvMedAlderspensjon.JA ? (
                                <SanityRikTekst text={sumAvInntekt?.skalGaaAvMedAlderspensjon?.ja?.[spraak]} />
                            ) : (
                                <SanityRikTekst text={sumAvInntekt?.skalGaaAvMedAlderspensjon?.neiVetIkke?.[spraak]} />
                            )}
                        </SumAvOppgittInntekt>
                    </>
                )}
            </>
        )
    )
}
