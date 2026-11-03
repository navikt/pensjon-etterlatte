import { FormSummary } from '@navikt/ds-react'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'
import { StegPath, stegUrl } from '../../../typer/steg'

export const OppsummeringSeksjon = ({
    tittel,
    endrePath,
    footer,
    children,
}: {
    tittel: string
    endrePath?: StegPath
    footer?: ReactNode
    children: ReactNode
}) => {
    const { t } = useTranslation()

    return (
        <FormSummary>
            <FormSummary.Header>
                <FormSummary.Heading level="3">{tittel}</FormSummary.Heading>
            </FormSummary.Header>
            <FormSummary.Answers>{children}</FormSummary.Answers>
            <FormSummary.Footer>
                {footer ??
                    (endrePath && (
                        <FormSummary.EditLink as={RouterLink} to={stegUrl(endrePath)}>
                            {t('oppsummering.endreSvar')}
                        </FormSummary.EditLink>
                    ))}
            </FormSummary.Footer>
        </FormSummary>
    )
}
