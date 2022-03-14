import { Accordion } from '@navikt/ds-react'
import { isEmpty } from 'lodash'
import { memo, useEffect, useState } from 'react'
import { User } from '../../../../context/user/user'
import useTranslation from '../../../../hooks/useTranslation'
import { IAboutYou } from '../../../../types/person'
import FormElement from '../../../common/FormElement'
import { AccordionItem } from '../AccordionItem'
import ApplicationMapper from '../ApplicationMapper'
import { elementPanel } from './elementPanel'

export const SummeryAboutYou = memo(
    ({ aboutYou, user, pathPrefix }: { aboutYou: IAboutYou; user: User; pathPrefix: string }) => {
        const [applicationSummary, setSummary] = useState<any>([])

        const { t } = useTranslation('aboutYou')
        const mapper = new ApplicationMapper(t)

        useEffect(() => {
            const applicationSummary = mapper.mapAboutYou(aboutYou, user)
            setSummary(applicationSummary)
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [aboutYou, user])

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
