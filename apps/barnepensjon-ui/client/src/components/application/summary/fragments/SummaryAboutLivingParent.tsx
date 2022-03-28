import { Accordion } from '@navikt/ds-react'
import { isEmpty } from 'lodash'
import { memo } from 'react'
import { ILivingParent } from '../../../../context/application/application'
import useTranslation from '../../../../hooks/useTranslation'
import { StepLabelKey, StepPath } from '../../../../utils/steps'
import FormElement from '../../../common/FormElement'
import { AccordionItem } from '../AccordionItem'
import { TextGroup } from '../TextGroup'
import PersonInfoSummary from './PersonInfoSummary'

interface Props {
    aboutTheParent: ILivingParent
    pathPrefix: string
}

export const SummaryAboutLivingParent = memo(({ aboutTheParent, pathPrefix }: Props) => {
    const { t } = useTranslation('livingParent')

    if (!aboutTheParent || isEmpty(aboutTheParent)) return null

    return (
        <FormElement>
            <Accordion>
                <AccordionItem
                    title={t('title')}
                    path={`/skjema/${pathPrefix}/${StepPath.AboutTheParents}`}
                    pathText={t(StepLabelKey.AboutTheParents, { ns: 'summary' })}
                >
                    <>
                        <PersonInfoSummary
                            firstName={aboutTheParent.firstName}
                            lastName={aboutTheParent.lastName}
                            fnrDnr={aboutTheParent.fnrDnr}
                            citizenship={aboutTheParent.citizenship}
                        />
                        <TextGroup title={t('address')} content={aboutTheParent?.address} />
                        {aboutTheParent.phoneNumber && (
                            <TextGroup title={t('phoneNumberOptional')} content={aboutTheParent.phoneNumber} />
                        )}
                    </>
                </AccordionItem>
            </Accordion>
        </FormElement>
    )
})
