import { FormProgress } from '@navikt/ds-react'
import { Navigate } from 'react-router-dom'
import { useSpraak } from './spraak/SpraakContext.tsx'
import { useSanityInnhold } from './sanity/useSanityInnhold.ts'

export const SkjemaProgresjon = ({ aktivtSteg }: { aktivtSteg: number }) => {
    const spraak = useSpraak()

    const { innhold, error, isLoading } = useSanityInnhold<never>('*[_type == "fellesKomponenter"].skjemaProgresjon')

    if (error && !isLoading) {
        return <Navigate to="/system-utilgjengelig" />
    }

    return (
        !!innhold && (
            <FormProgress
                totalSteps={4}
                activeStep={aktivtSteg}
                translations={{
                    step: `${innhold['stegXAvX']['steg'][spraak]} ${aktivtSteg} ${innhold['stegXAvX']['av'][spraak]} ${4}`,
                    showAllSteps: innhold['visAlleSteg'][spraak],
                    hideAllSteps: innhold['skjulAlleSteg'][spraak],
                }}
            >
                <FormProgress.Step interactive={false}>{innhold['stegLabels']['steg1'][spraak]}</FormProgress.Step>
                <FormProgress.Step interactive={false}>{innhold['stegLabels']['steg2'][spraak]}</FormProgress.Step>
                <FormProgress.Step interactive={false}>{innhold['stegLabels']['steg3'][spraak]}</FormProgress.Step>
                <FormProgress.Step interactive={false}>{innhold['stegLabels']['steg4'][spraak]}</FormProgress.Step>
            </FormProgress>
        )
    )
}
