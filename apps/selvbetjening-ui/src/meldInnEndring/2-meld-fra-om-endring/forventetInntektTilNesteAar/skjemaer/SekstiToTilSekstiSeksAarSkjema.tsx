import { Box, Radio, ReadMore, TextField, VStack } from '@navikt/ds-react'
import { useFormContext } from 'react-hook-form'
import { ControlledMaanedVelger } from '../../../../common/maanedVelger/ControlledMaanedVelger.tsx'
import { ControlledRadioGruppe } from '../../../../common/radioGruppe/ControlledRadioGruppe.tsx'
import { ControlledInntektTextField } from '../../../../inntektsjustering/components/controlledInntektTextField/ControlledInntektTextField.tsx'
import { Alder, MeldtInnEndring, SkalGaaAvMedAlderspensjon } from '../../../../types/meldInnEndring.ts'
import { IInnloggetBruker } from '../../../../types/person.ts'
import { SumAvOppgittInntekt } from './SumAvOppgittInntekt.tsx'
import { forventetInntektTilNesteAarSkjemaValuesTilValues } from './utils.ts'

export const SekstiToTilSekstiSeksAarSkjema = ({ innloggetBruker }: { innloggetBruker: IInnloggetBruker }) => {
    const {
        control,
        register,
        watch,
        formState: { errors },
    } = useFormContext<MeldtInnEndring>()

    const skalViseAfpPrivat = (innloggetBruker: IInnloggetBruker): boolean => {
        return innloggetBruker.foedselsaar! < 1963
    }

    const nesteAar = new Date().getFullYear() + 1
    const foersteDagNesteAar = new Date(nesteAar, 0, 1)
    const sisteDagNesteAar = new Date(nesteAar, 11, 31)

    return (
        <>
            <VStack gap="2">
                <ControlledRadioGruppe
                    name={'forventetInntektTilNesteAar.skalGaaAvMedAlderspensjon'}
                    control={control}
                    legend={'Skal du gå av med alderspensjon?'}
                    description={'Beskrivelse jauda'}
                    errorVedTomInput="hei her var det mye feil"
                    radios={
                        <>
                            <Radio value={SkalGaaAvMedAlderspensjon.JA}>Ja</Radio>
                            <Radio value={SkalGaaAvMedAlderspensjon.NEI}>Nei</Radio>
                            <Radio value={SkalGaaAvMedAlderspensjon.VET_IKKE}>Vet ikke</Radio>
                        </>
                    }
                />
                <ReadMore header={'Skal du gå av'}>Masse info om hvis man skal gå av</ReadMore>
            </VStack>
            {watch('forventetInntektTilNesteAar.skalGaaAvMedAlderspensjon') !== undefined && (
                <>
                    {watch('forventetInntektTilNesteAar.skalGaaAvMedAlderspensjon') ===
                        SkalGaaAvMedAlderspensjon.JA && (
                        <>
                            <VStack gap="2">
                                <ControlledMaanedVelger
                                    name={'forventetInntektTilNesteAar.datoForAaGaaAvMedAlderspensjon'}
                                    control={control}
                                    label={'Når skal du gå av med alterspensjon'}
                                    description="God beskrivelse er hja"
                                    errorVedTomInput="enda mer som er feil"
                                    fromDate={foersteDagNesteAar}
                                    toDate={sisteDagNesteAar}
                                />
                                <ReadMore header={'Mer info om å gå av med alderspensjon'}>Enda mer info</ReadMore>
                            </VStack>
                            <div>Oms vil ta slutt om litt</div>
                        </>
                    )}

                    {watch('forventetInntektTilNesteAar.skalGaaAvMedAlderspensjon') === SkalGaaAvMedAlderspensjon.JA ? (
                        <div>Tekst om Ja til skal gå av med alderspensjon</div>
                    ) : (
                        <div>Tekst om Nei/Vet ikke til skal gå av med alderspensjon</div>
                    )}

                    <VStack gap="2">
                        <ControlledInntektTextField
                            name={'forventetInntektTilNesteAar.arbeidsinntekt'}
                            control={control}
                            label={'Arbeidsinntekt'}
                            description={'Bekrivelse'}
                        />
                        <ReadMore header={'Mer om arbeidsinntekt'}>Masse mer om arbeidsinntekt</ReadMore>
                    </VStack>

                    <VStack gap="2">
                        <ControlledInntektTextField
                            name={'forventetInntektTilNesteAar.naeringsinntekt'}
                            control={control}
                            label={'Næringsinntekt'}
                            description="Bekrivelse"
                        />
                        <ReadMore header={'Næringsinntekt'}>Næsdgpoj</ReadMore>
                    </VStack>

                    <ControlledInntektTextField
                        name={'forventetInntektTilNesteAar.afpInntekt'}
                        control={control}
                        label={skalViseAfpPrivat(innloggetBruker) ? 'Afp privat' : 'Afp privat eller offentlig'}
                        description={'spiogj'}
                    />
                    {!!watch('forventetInntektTilNesteAar.afpInntekt') &&
                        watch('forventetInntektTilNesteAar.afpInntekt') !== '0' && (
                            <Box maxWidth="25rem">
                                <TextField
                                    {...register('forventetInntektTilNesteAar.afpTjenesteordning', {
                                        required: {
                                            value: true,
                                            message: 'Error ved tom input',
                                        },
                                    })}
                                    label={'AFP tjenestepensjonsordning'}
                                    description={'Bsoigh'}
                                    error={errors.forventetInntektTilNesteAar?.afpTjenesteordning?.message}
                                />
                            </Box>
                        )}

                    <VStack gap="2">
                        <ControlledInntektTextField
                            name={'forventetInntektTilNesteAar.inntektFraUtland'}
                            control={control}
                            label="Inntekt fra utland"
                            description={'soigh'}
                        />
                        <ReadMore header={'Informasjon om inntekt fra utland'}>sgipjsdgp</ReadMore>
                    </VStack>

                    <SumAvOppgittInntekt
                        forventetInntektTilNesteAar={forventetInntektTilNesteAarSkjemaValuesTilValues(
                            watch('forventetInntektTilNesteAar')!
                        )}
                        alder={Alder.SEKSTI_TO_TIL_SEKSTI_SEKS}
                    >
                        {watch('forventetInntektTilNesteAar.skalGaaAvMedAlderspensjon') ===
                        SkalGaaAvMedAlderspensjon.JA ? (
                            <div>Ja til skal gå av med alderspensjon</div>
                        ) : (
                            <div>Nei/Vet ikke til skal gå av med alderspensjon</div>
                        )}
                    </SumAvOppgittInntekt>
                </>
            )}
        </>
    )
}
