import { Accordion } from '@navikt/ds-react'
import { isEmpty } from 'lodash'
import { memo, useEffect, useState } from 'react'
import useTranslation from '../../../../hooks/useTranslation'
import { ISituationChild } from '../../../../types/situation'
import FormElement from '../../../common/FormElement'
import { AccordionItem } from '../AccordionItem'
import ApplicationMapper from '../ApplicationMapper'
import { elementPanel } from './elementPanel'

export const SummaryYourSituation = memo(
    ({ yourSituation, pathPrefix }: { yourSituation: ISituationChild; pathPrefix: string }) => {
        const [applicationSummary, setSummary] = useState<any>([])

        const { t } = useTranslation('yourSituation')
        const mapper = new ApplicationMapper(t)

        useEffect(() => {
            const applicationSummary = mapper.mapYourSituation(yourSituation)
            setSummary(applicationSummary)
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [yourSituation])

        return (
            <>
                {!isEmpty(applicationSummary) && (
                    <FormElement>
                        <Accordion>
                            <AccordionItem
                                title={applicationSummary.title}
                                path={`/skjema/${pathPrefix}/steg/${applicationSummary.path}`}
                                pathText={t(`changeAnswerSummary.${applicationSummary.path}`)}
                            >
                                {applicationSummary.elements.map(elementPanel)}
                            </AccordionItem>
                        </Accordion>
                    </FormElement>
                )}
            </>
        )
    }
)
