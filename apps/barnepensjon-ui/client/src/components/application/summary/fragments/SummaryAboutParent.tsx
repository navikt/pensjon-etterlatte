import { Accordion } from '@navikt/ds-react'
import { isEmpty } from 'lodash'
import { memo, useEffect, useState } from 'react'
import { IDeceasedParent } from '../../../../context/application/application'
import useTranslation from '../../../../hooks/useTranslation'
import FormElement from '../../../common/FormElement'
import { ApplicantSituation } from '../../scenario/ScenarioSelection'
import { AccordionItem } from '../AccordionItem'
import ApplicationMapper from '../ApplicationMapper'
import { elementPanel } from './elementPanel'

export const SummaryAboutParent = memo(
    ({
        aboutTheParent,
        typeOfParent,
        pathPrefix,
    }: {
        aboutTheParent: IDeceasedParent
        typeOfParent?: ApplicantSituation
        pathPrefix: string
    }) => {
        const [applicationSummary, setSummary] = useState<any>([])

        const { t } = useTranslation('aboutTheDeceased')
        const mapper = new ApplicationMapper(t)

        useEffect(() => {
            const applicationSummary = mapper.mapAboutTheParent(aboutTheParent)
            setSummary(applicationSummary)
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [aboutTheParent])

        return (
            <>
                {!isEmpty(applicationSummary) && (
                    <FormElement>
                        <Accordion>
                            <AccordionItem
                                title={
                                    typeOfParent === ApplicantSituation.ONE_PARENT_DECEASED
                                        ? t('title.livingParent')
                                        : applicationSummary.title
                                }
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
