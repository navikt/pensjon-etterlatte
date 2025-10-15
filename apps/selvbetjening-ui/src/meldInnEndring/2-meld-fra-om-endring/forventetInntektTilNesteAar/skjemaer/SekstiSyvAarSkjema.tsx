import { Box, Radio, ReadMore, TextField, VStack } from '@navikt/ds-react'
import { useFormContext } from 'react-hook-form'
import { ControlledMaanedVelger } from '../../../../common/maanedVelger/ControlledMaanedVelger.tsx'
import { ControlledRadioGruppe } from '../../../../common/radioGruppe/ControlledRadioGruppe.tsx'
import { ControlledInntektTextField } from '../../../../inntektsjustering/components/controlledInntektTextField/ControlledInntektTextField.tsx'
import { Alder, MeldtInnEndring, SkalGaaAvMedAlderspensjon } from '../../../../types/meldInnEndring.ts'
import { SumAvOppgittInntekt } from './SumAvOppgittInntekt.tsx'
import { forventetInntektTilNesteAarSkjemaValuesTilValues } from './utils.ts'

export const SekstiSyvAarSkjema = () => {
    const {
        control,
        register,
        watch,
        formState: { errors },
    } = useFormContext<MeldtInnEndring>()

    const nesteAar = new Date().getFullYear() + 1
    const foersteDagNesteAar = new Date(nesteAar, 0, 1)
    const sisteDagNesteAar = new Date(nesteAar, 11, 31)

    return (
        <>
            <VStack gap="2">
                <ControlledRadioGruppe
                    name={'forventetInntektTilNesteAar.skalGaaAvMedAlderspensjon'}
                    control={control}
                    legend={'Skal gå av med alderspensjon'}
                    description={'afasdasdasd'}
                    errorVedTomInput={'Her varre mye feil'}
                    radios={
                        <>
                            <Radio value={SkalGaaAvMedAlderspensjon.JA}>Ja</Radio>
                            <Radio value={SkalGaaAvMedAlderspensjon.NEI}>Nei</Radio>
                            <Radio value={SkalGaaAvMedAlderspensjon.VET_IKKE}>Vet ikke</Radio>
                        </>
                    }
                />
                <ReadMore header={'Skal gå av med alderspensjon info'}>asdasdasdas</ReadMore>
            </VStack>
            {watch('forventetInntektTilNesteAar.skalGaaAvMedAlderspensjon') !== undefined && (
                <>
                    {watch('forventetInntektTilNesteAar.skalGaaAvMedAlderspensjon') ===
                        SkalGaaAvMedAlderspensjon.JA && (
                        <VStack gap="2">
                            <ControlledMaanedVelger
                                name={'forventetInntektTilNesteAar.datoForAaGaaAvMedAlderspensjon'}
                                control={control}
                                label={'Når skal du gå av med alderspensjon'}
                                description={'sdpogj'}
                                errorVedTomInput={'Jauda mytti feil'}
                                fromDate={foersteDagNesteAar}
                                toDate={sisteDagNesteAar}
                            />
                            <ReadMore header={'Info om når du skal gå av med alderspensjon'}>sdpgojsgd</ReadMore>
                        </VStack>
                    )}

                    <div>Info om inntekter som skal meldes inn</div>

                    <VStack gap="2">
                        <ControlledInntektTextField
                            name={'forventetInntektTilNesteAar.arbeidsinntekt'}
                            control={control}
                            label="Arbeidsinntekt"
                            description={'sadasdad'}
                        />
                        <ReadMore header={'Arbeidsinntekter'}>asdasdasd</ReadMore>
                    </VStack>

                    <VStack gap="2">
                        <ControlledInntektTextField
                            name={'forventetInntektTilNesteAar.naeringsinntekt'}
                            control={control}
                            label={'Næringsinntekt'}
                            description={'sfsdf'}
                        />
                        <ReadMore header={'Næringsinntekter'}>asada</ReadMore>
                    </VStack>

                    <ControlledInntektTextField
                        name={'forventetInntektTilNesteAar.afpInntekt'}
                        control={control}
                        label={'AFP offentlig og privat'}
                        description="ASdasd"
                    />

                    {!!watch('forventetInntektTilNesteAar.afpInntekt') &&
                        watch('forventetInntektTilNesteAar.afpInntekt') !== '0' && (
                            <Box maxWidth="25rem">
                                <TextField
                                    {...register('forventetInntektTilNesteAar.afpTjenesteordning', {
                                        required: {
                                            value: true,
                                            message: 'Jauda her varre mye feil',
                                        },
                                    })}
                                    label={'AFP tjenestepensjonsordning'}
                                    description="sdpogj"
                                    error={errors.forventetInntektTilNesteAar?.afpTjenesteordning?.message}
                                />
                            </Box>
                        )}
                    <VStack gap="2">
                        <ControlledInntektTextField
                            name={'forventetInntektTilNesteAar.inntektFraUtland'}
                            control={control}
                            label={'Inntekt fra utland'}
                            description={'sdgpj'}
                        />
                        <ReadMore header={'Masse mer inntekter fra utland'}>sdogjsdg</ReadMore>
                    </VStack>

                    <SumAvOppgittInntekt
                        forventetInntektTilNesteAar={forventetInntektTilNesteAarSkjemaValuesTilValues(
                            watch('forventetInntektTilNesteAar')!
                        )}
                        alder={Alder.SEKSTI_SYV}
                    >
                        {watch('forventetInntektTilNesteAar.skalGaaAvMedAlderspensjon') === SkalGaaAvMedAlderspensjon.JA
                            ? 'Ja til har gått av med alderspensjon'
                            : 'Nei til har gått av med alderspenskjon'}
                    </SumAvOppgittInntekt>
                </>
            )}
        </>
    )
}
