import { isEmpty } from 'lodash'
import { memo } from 'react'
import useTranslation from '../../../../hooks/useTranslation'
import { ISituationChild } from '../../../../types/situation'
import { StepLabelKey, StepPath } from '../../../../utils/steps'
import { AccordionItem } from '../AccordionItem'
import { TextGroup, TextGroupJaNeiVetIkke } from '../TextGroup'

interface Props {
    pathPrefix: string
    yourSituation?: ISituationChild
}

export const SummaryYourSituation = memo(({ yourSituation, pathPrefix }: Props) => {
    const { t } = useTranslation('yourSituation')

    if (!yourSituation || isEmpty(yourSituation)) return null

    return (
        <AccordionItem
            title={t('title')}
            path={`/skjema/${pathPrefix}/${StepPath.YourSituation}`}
            pathText={t(StepLabelKey.YourSituation, { ns: 'summary' })}
        >
            <>
                <TextGroup
                    title={t('whyDoYouApply')}
                    content={yourSituation.whyDoYouApply?.map((item) => ` ${t(item)}`).toString()}
                />
                <TextGroup
                    title={t('timeUsedForEducation')}
                    content={t(yourSituation.timeUsedForEducation as string)}
                />
                <TextGroupJaNeiVetIkke title={t('doYouHaveIncome')} content={yourSituation.doYouHaveIncome} />
            </>
        </AccordionItem>
    )
})
