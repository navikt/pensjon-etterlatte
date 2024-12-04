import { FormProgress } from '@navikt/ds-react'
import { Navigate } from 'react-router-dom'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { FellesKomponenter } from '../../sanity.types.ts'

export const SkjemaProgresjon = ({ aktivtSteg }: { aktivtSteg: number }) => {
    const spraak = useSpraak()

    const { innhold, error, isLoading } = useSanityInnhold<FellesKomponenter>('*[_type == "fellesKomponenter"]')

    if (error && !isLoading) {
        return <Navigate to="/system-utilgjengelig" />
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
