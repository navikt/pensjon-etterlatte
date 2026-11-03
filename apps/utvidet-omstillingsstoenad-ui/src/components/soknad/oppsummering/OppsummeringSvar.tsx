import { FormSummary } from '@navikt/ds-react'

const harSvar = (verdi: unknown) => verdi !== undefined && verdi !== null && verdi !== ''

export const OppsummeringSvar = ({ spoersmaal, svar }: { spoersmaal: string; svar?: string }) => {
    if (!harSvar(svar)) return null

    return (
        <FormSummary.Answer>
            <FormSummary.Label>{spoersmaal}</FormSummary.Label>
            <FormSummary.Value>{svar}</FormSummary.Value>
        </FormSummary.Answer>
    )
}
