import { Box } from '@navikt/ds-react'
import { memo } from 'react'
import useTranslation from '../../../../hooks/useTranslation'
import { StepLabelKey, StepPath } from '../../../../utils/steps'
import { AccordionItem } from '../AccordionItem'
import { TextGroup } from '../TextGroup'

interface Props {
    pathPrefix: string
}

export const SummaryAboutUnknownParent = memo(({ pathPrefix }: Props) => {
    const { t } = useTranslation('aboutParents')

    return (
        <AccordionItem
            title={t('unknownParentTitle')}
            path={`/skjema/${pathPrefix}/${StepPath.AboutTheParents}`}
            pathText={t(StepLabelKey.AboutTheParents, {
                ns: 'summary',
            })}
        >
            <Box marginBlock="4">
                <TextGroup title={t('unknownParentQuestion')} content={t('yesUnknownParent', { ns: 'btn' })} />
            </Box>
        </AccordionItem>
    )
})
