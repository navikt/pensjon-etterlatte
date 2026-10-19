import { FormSummary } from '@navikt/ds-react'
import { ReactNode } from 'react'

interface Props {
    title: string
    children: ReactNode
}

export const SummaryGroup = ({ title, children }: Props) => {
    return (
        <FormSummary.Answer>
            <FormSummary.Label>{title}</FormSummary.Label>
            <FormSummary.Value>
                <FormSummary.Answers>{children}</FormSummary.Answers>
            </FormSummary.Value>
        </FormSummary.Answer>
    )
}
