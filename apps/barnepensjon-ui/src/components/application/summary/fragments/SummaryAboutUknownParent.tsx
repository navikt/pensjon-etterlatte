import { memo } from 'react'
import useTranslation from '../../../../hooks/useTranslation'
import { StepLabelKey, StepPath } from '../../../../utils/steps'
import FormElement from '../../../common/FormElement'
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
            <FormElement>
                <TextGroup title={t('unknownParentQuestion')} content={t('yesUnknownParent', { ns: 'btn' })} />
            </FormElement>
        </AccordionItem>
    )
})
