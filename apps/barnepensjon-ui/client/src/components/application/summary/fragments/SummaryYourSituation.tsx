import { Accordion } from '@navikt/ds-react'
import { isEmpty } from 'lodash'
import { memo } from 'react'
import useTranslation from '../../../../hooks/useTranslation'
import { ISituationChild } from '../../../../types/situation'
import { StepPath } from '../../../../utils/steps'
import FormElement from '../../../common/FormElement'
import { AccordionItem } from '../AccordionItem'
import { TextGroup, TextGroupJaNeiVetIkke } from '../TextGroup'

export const SummaryYourSituation = memo(
    ({ yourSituation, pathPrefix }: { yourSituation: ISituationChild; pathPrefix: string }) => {
        const { t } = useTranslation('yourSituation')

        return (
            <>
                {!isEmpty(yourSituation) && (
                    <FormElement>
                        <Accordion>
                            <AccordionItem
                                title={t('title')}
                                path={`/skjema/${pathPrefix}/${StepPath.YourSituation}`}
                                pathText={t(`changeAnswerSummary.${StepPath.YourSituation}`)}
                            >
                                <>
                                    <TextGroup
                                        title={t('whyDoYouApply')}
                                        content={yourSituation.whyDoYouApply?.map((item) => ` ${t(item)}`)}
                                    />
                                    <TextGroup
                                        title={t('timeUsedForEducation')}
                                        content={t(yourSituation.timeUsedForEducation as string)}
                                    />
                                    <TextGroupJaNeiVetIkke
                                        title={t('doYouHaveIncome')}
                                        content={yourSituation.doYouHaveIncome}
                                    />
                                </>
                            </AccordionItem>
                        </Accordion>
                    </FormElement>
                )}
            </>
        )
    }
)
