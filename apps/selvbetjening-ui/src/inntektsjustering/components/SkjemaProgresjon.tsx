import { FormProgress } from '@navikt/ds-react'

export const SkjemaProgresjon = ({ aktivtSteg }: { aktivtSteg: number }) => {
    return (
        <FormProgress totalSteps={4} activeStep={aktivtSteg}>
            <FormProgress.Step interactive={false}>Innledning</FormProgress.Step>
            <FormProgress.Step interactive={false}>Inntekt til neste år</FormProgress.Step>
            <FormProgress.Step interactive={false}>Oppsummering</FormProgress.Step>
            <FormProgress.Step interactive={false}>Kvittering</FormProgress.Step>
        </FormProgress>
    )
}
