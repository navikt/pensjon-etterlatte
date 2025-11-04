import { FormProgress } from '@navikt/ds-react'
import { useSanityInnhold } from '../sanity/useSanityInnhold.ts'
import { SkjemaHeader } from '../sanity.types.ts'
import { useSpraak } from '../spraak/SpraakContext.tsx'

export const SkjemaProgresjon = ({
    aktivtSteg,
    skjemaNavn,
}: {
    aktivtSteg: number
    skjemaNavn: 'inntektsjustering' | 'meld-inn-endring'
}) => {
    const spraak = useSpraak()

    const { innhold, innholdError, innholdIsLoading } = useSanityInnhold<SkjemaHeader>(
        `*[_type == "skjemaHeader" ${encodeURIComponent('&&')} dokumentTittel == "${skjemaNavn}"]`
    )

    if (innholdError && !innholdIsLoading) {
        throw innholdError
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
