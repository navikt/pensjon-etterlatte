import { FormSummary } from '@navikt/ds-react'
import { ReactNode } from 'react'
import { Link } from 'react-router'

interface Props {
    title: string
    path: string
    pathText: string
    children: ReactNode
}

export const SummarySection = ({ title, path, pathText, children }: Props) => {
    return (
        <FormSummary>
            <FormSummary.Header>
                <FormSummary.Heading level="2">{title}</FormSummary.Heading>
            </FormSummary.Header>
            <FormSummary.Answers>{children}</FormSummary.Answers>
            <FormSummary.Footer>
                <FormSummary.EditLink as={Link} to={path}>
                    {pathText}
                </FormSummary.EditLink>
            </FormSummary.Footer>
        </FormSummary>
    )
}
