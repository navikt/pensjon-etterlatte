import { Accordion } from '@navikt/ds-react'
import { isEmpty } from 'lodash'
import { memo, useEffect, useState } from 'react'
import useTranslation from '../../../../hooks/useTranslation'
import { IAboutChild } from '../../../../types/person'
import FormElement from '../../../common/FormElement'
import { AccordionItem } from '../AccordionItem'
import ApplicationMapper from '../ApplicationMapper'
import { elementPanel } from './elementPanel'

export const SummaryAboutChildren = memo(
    ({ aboutChildren, pathPrefix }: { aboutChildren: IAboutChild; pathPrefix: string }) => {
        const [applicationSummary, setSummary] = useState<any>([])

        const { t } = useTranslation('aboutChildren')
        const mapper = new ApplicationMapper(t)

        useEffect(() => {
            const applicationSummary = mapper.mapAboutChildren(aboutChildren)
            setSummary(applicationSummary)
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [aboutChildren])

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
