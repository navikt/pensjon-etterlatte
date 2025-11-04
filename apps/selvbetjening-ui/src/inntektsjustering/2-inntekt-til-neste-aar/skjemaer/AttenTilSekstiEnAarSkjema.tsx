import { ReadMore, VStack } from '@navikt/ds-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { NavigasjonMeny } from '../../../common/navigasjonMeny/NavigasjonMeny.tsx'
import { SideLaster } from '../../../common/SideLaster.tsx'
import { SammendragAvSkjemaFeil } from '../../../common/sammendragAvSkjemaFeil/SammendragAvSkjemaFeil.tsx'
import { SanityRikTekst } from '../../../common/sanity/SanityRikTekst.tsx'
import { useSanityInnhold } from '../../../common/sanity/useSanityInnhold.ts'
import { useSpraak } from '../../../common/spraak/SpraakContext.tsx'
import { Inntekt, InntektSkjema } from '../../../types/inntektsjustering.ts'
import { Alder } from '../../../types/person.ts'
import { ControlledInntektTextField } from '../../components/controlledInntektTextField/ControlledInntektTextField.tsx'
import { useInntekt, useInntektDispatch } from '../../components/inntektContext/InntektContext.tsx'
import { InntektsjusteringInntektTilNesteAar as InntektsjusteringInntektTilNesteAarInnhold } from '../../sanity.types.ts'
import { SumAvOppgittInntekt } from '../SumAvOppgittInntekt.tsx'
import { inntektSkjemaValuesTilInntekt, inntektTilInntektSkjemaValues } from './utils.ts'

export const AttenTilSekstiEnAarSkjema = () => {
    const spraak = useSpraak()

    const inntekt = useInntekt()
    const inntektDispatch = useInntektDispatch()

    const navigate = useNavigate()

    const {
        innhold,
        innholdError: innholdError,
        innholdIsLoading: innholdIsLoading,
    } = useSanityInnhold<InntektsjusteringInntektTilNesteAarInnhold>(
        '*[_type == "inntektsjusteringInntektTilNesteAar"]'
    )

    const {
        control,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<InntektSkjema>({
        defaultValues: inntektTilInntektSkjemaValues(inntekt, spraak),
    })

    if (innholdIsLoading) {
        return <SideLaster />
    }
    if (innholdError) {
        throw innholdError
    }

    if (!innhold?.inntektSkjemaer?.attenTilSekstiEnAarSkjema) {
        throw Error('Finner ikke sanity innhold for skjema 18-61 år')
    }

    const onInntektSubmit = (inntekt: Inntekt) => {
        inntektDispatch.setInntekt(inntekt)
        navigate('/inntekt/oppsummering')
    }

    const { hovedinnhold, arbeidsinntekt, naeringsinntekt, inntektFraUtland, sumAvInntekt } =
        innhold.inntektSkjemaer.attenTilSekstiEnAarSkjema

    return (
        !!innhold && (
            <form>
                <VStack gap="6" width="fit-content">
                    <div>
                        <SanityRikTekst text={hovedinnhold?.[spraak]} />
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

                    <SumAvOppgittInntekt
                        inntektTilNesteAar={inntektSkjemaValuesTilInntekt(watch())}
                        alder={Alder.ATTEN_TIL_SEKSTI_EN}
                    >
                        <SanityRikTekst text={sumAvInntekt?.[spraak]} />
                    </SumAvOppgittInntekt>

                    <SammendragAvSkjemaFeil errors={errors} />

                    <NavigasjonMeny
                        tilbakePath="/inntekt/innledning"
                        onNeste={handleSubmit((inntekt) => onInntektSubmit(inntektSkjemaValuesTilInntekt(inntekt)))}
                    />
                </VStack>
            </form>
        )
    )
}
