import { useForm } from 'react-hook-form'
import { Endring, MeldtInnEndring } from '../../types/meldInnEndring.ts'
import { HStack, Radio, Textarea, VStack } from '@navikt/ds-react'
import { ControlledRadioGruppe } from '../../common/radioGruppe/ControlledRadioGruppe.tsx'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { MeldInnEndringMeldFra as MeldInnEndringMeldFraInnhold } from '../sanity.types.ts'
import { SideLaster } from '../../common/SideLaster.tsx'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'

export const MeldInnEndringMeldFra = () => {
    const spraak = useSpraak()

    const { register, control } = useForm<MeldtInnEndring>()

    const { innhold, error, isLoading } = useSanityInnhold<MeldInnEndringMeldFraInnhold>(
        '*[_type == "meldInnEndringMeldFra"]'
    )

    if (isLoading) {
        return <SideLaster />
    }

    if (error) {
        throw error
    }

    return (
        !!innhold && (
            <main>
                <HStack justify="center" padding="8" minHeight="100vh">
                    <VStack gap="6" maxWidth="42.5rem">
                        <SkjemaHeader aktivtSteg={2} stegLabelKey="steg2" skjemaNavn="meld-inn-endring" />
                        <form>
                            <VStack gap="6" width="fit-content">
                                <ControlledRadioGruppe
                                    name="endring"
                                    control={control}
                                    legend={innhold.endring?.legend?.[spraak]}
                                    description={innhold.endring?.legend?.[spraak]}
                                    errorVedTomInput={innhold.endring?.legend?.[spraak]}
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
                                            <Radio value={Endring.INNTEKT}>s</Radio>
                                            <Radio value={Endring.ANNET}>Annet</Radio>
                                        </>
                                    }
                                />
                                <Textarea
                                    {...register('beskrivelse', {
                                        required: { value: true, message: 'Du må legge inn en beskrivelse' },
                                    })}
                                    label="Beskriv endringen din"
                                    description="Gi en kort beskrivelse"
                                />
                            </VStack>
                        </form>
                    </VStack>
                </HStack>
            </main>
        )
    )
}
