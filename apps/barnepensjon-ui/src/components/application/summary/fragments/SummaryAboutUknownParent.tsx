import { memo } from 'react'
import useTranslation from '../../../../hooks/useTranslation'
import { StepLabelKey, StepPath } from '../../../../utils/steps'
import { SummarySection } from '../SummarySection'
import { TextGroup } from '../TextGroup'

interface Props {
    pathPrefix: string
}

export const SummaryAboutUnknownParent = memo(({ pathPrefix }: Props) => {
    const { t } = useTranslation('aboutParents')

    return (
        <SummarySection
            title={t('unknownParentTitle')}
            path={`/skjema/${pathPrefix}/${StepPath.AboutTheParents}`}
            pathText={t(StepLabelKey.AboutTheParents, {
                ns: 'summary',
            })}
        >
            <TextGroup title={t('unknownParentQuestion')} content={t('yesUnknownParent', { ns: 'btn' })} />
        </SummarySection>
    )
})
