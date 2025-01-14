import { useForm } from 'react-hook-form'
import { Endring, MeldtInnEndring } from '../../types/meldInnEndring.ts'
import { HStack, Radio, Textarea, VStack } from '@navikt/ds-react'
import { ControlledRadioGruppe } from '../../common/radioGruppe/ControlledRadioGruppe.tsx'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'

export const MeldInnEndringMeldFra = () => {
    const { register, control } = useForm<MeldtInnEndring>()

    return (
        <main>
            <HStack justify="center" padding="8" minHeight="100vh">
                <VStack gap="6" maxWidth="42.5rem">
                    <SkjemaHeader aktivtSteg={2} stegLabelKey="steg2" skjemaNavn="meld-inn-endring" />
                    <form>
                        <VStack gap="6" width="fit-content">
                            <ControlledRadioGruppe
                                name="endring"
                                control={control}
                                legend="Hva gjelder endringen?"
                                description="Foreløpig kan du kun melde fra om ett tema per skjema."
                                errorVedTomInput="Du må velge ett tema"
                                radios={
                                    <>
                                        <Radio
                                            value={Endring.AKTIVITET_OG_INNTEKT}
                                            description="Jobb, studie eller lignende"
                                        >
                                            Aktivitet og inntekt
                                        </Radio>
                                        <Radio value={Endring.INNTEKT}>Kun inntekt</Radio>
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
}
