import { FormProgress } from '@navikt/ds-react'
import { useSpraak } from '../spraak/SpraakContext.tsx'
import { useSanityInnhold } from '../sanity/useSanityInnhold.ts'
import { SkjemaHeader } from '../sanity.types.ts'

export const SkjemaProgresjon = ({
    aktivtSteg,
    skjemaNavn,
}: {
    aktivtSteg: number
    skjemaNavn: 'inntektsjustering' | 'meld-inn-endring'
}) => {
    const spraak = useSpraak()

    const { innhold, error, isLoading } = useSanityInnhold<SkjemaHeader>(
        `*[_type == "skjemaHeader" ${encodeURIComponent('&&')} dokumentTittel == "${skjemaNavn}"]`
    )

    if (error && !isLoading) {
        throw error
    }

    return (
        !!innhold && (
            <FormProgress
                totalSteps={4}
                activeStep={aktivtSteg}
                translations={{
                    step: `${innhold.skjemaProgresjon?.stegXAvX?.steg?.[spraak]} ${aktivtSteg} ${innhold.skjemaProgresjon?.stegXAvX?.av?.[spraak]} ${4}`,
                    showAllSteps: innhold.skjemaProgresjon?.visAlleSteg?.[spraak],
                    hideAllSteps: innhold.skjemaProgresjon?.skjulAlleSteg?.[spraak],
                }}
            >
                <FormProgress.Step interactive={false}>
                    {innhold.skjemaProgresjon?.stegLabels?.steg1?.[spraak] ?? ''}
                </FormProgress.Step>
                <FormProgress.Step interactive={false}>
                    {innhold.skjemaProgresjon?.stegLabels?.steg2?.[spraak] ?? ''}
                </FormProgress.Step>
                <FormProgress.Step interactive={false}>
                    {innhold.skjemaProgresjon?.stegLabels?.steg3?.[spraak] ?? ''}
                </FormProgress.Step>
                <FormProgress.Step interactive={false}>
                    {innhold.skjemaProgresjon?.stegLabels?.steg4?.[spraak] ?? ''}
                </FormProgress.Step>
            </FormProgress>
        )
    )
}
