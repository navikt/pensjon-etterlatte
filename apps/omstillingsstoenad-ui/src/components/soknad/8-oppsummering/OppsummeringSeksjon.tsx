import { FormSummary } from '@navikt/ds-react'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

interface Props {
    tittel: string
    path: string
    pathText: string
    senderSoeknad?: boolean
    medSvarliste?: boolean
    children: ReactNode
}

export const OppsummeringSeksjon = ({
    tittel,
    path,
    pathText,
    senderSoeknad,
    medSvarliste = true,
    children,
}: Props) => {
    const { t } = useTranslation()

    return (
        <FormSummary>
            <FormSummary.Header>
                <FormSummary.Heading level="2">{tittel}</FormSummary.Heading>
            </FormSummary.Header>
            {medSvarliste ? <FormSummary.Answers>{children}</FormSummary.Answers> : children}
            <FormSummary.Footer>
                <FormSummary.EditLink as={Link} to={path} className={senderSoeknad ? 'disabled' : ''}>
                    {t(`endreSvarOppsummering.${pathText}`)}
                </FormSummary.EditLink>
            </FormSummary.Footer>
        </FormSummary>
    )
}
