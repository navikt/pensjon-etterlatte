import { Accordion, Heading, Panel } from '@navikt/ds-react'
import { isEmpty } from 'lodash'
import { memo } from 'react'
import { v4 as uuid } from 'uuid'
import { JaNeiVetIkke } from '../../../../api/dto/FellesOpplysninger'
import useTranslation from '../../../../hooks/useTranslation'
import { IAboutChildren, IChild, ParentRelationType } from '../../../../types/person'
import { StepLabelKey, StepPath, StepPrefix } from '../../../../utils/steps'
import FormElement from '../../../common/FormElement'
import { ApplicantRole } from '../../scenario/ScenarioSelection'
import { AccordionItem } from '../AccordionItem'
import { TextGroup, TextGroupJaNeiVetIkke } from '../TextGroup'
import PaymentDetailsSummary from './PaymentDetailsSummary'
import { IParent } from '../../../../context/application/application'
import PersonInfoSummary from './PersonInfoSummary'

interface Props {
    aboutChildren?: IAboutChildren
    pathPrefix: string
    applicationRole?: ApplicantRole
    parents: {
        firstParent: any
        secondParent: any
    }
}

export const SummaryAboutChildren = memo(({ aboutChildren, pathPrefix, applicationRole, parents }: Props) => {
    const { t } = useTranslation('aboutChildren')

    if (!aboutChildren || isEmpty(aboutChildren)) return null

    const isParent = applicationRole === ApplicantRole.PARENT
    const isChild = applicationRole === ApplicantRole.CHILD

    const parentAnswerText = (child: IChild): string => {
        switch (child.parents) {
            case ParentRelationType.FIRST_PARENT:
                return t('remainingParentsChild')
            case ParentRelationType.SECOND_PARENT:
                return t('deceasedParentsChild')
            case ParentRelationType.BOTH:
                return t('jointChild')
            default:
                throw Error(`Unexpected parent relation: ${child.parents}`)
        }
    }

    const childOrGuardianAnswerText = (child: IChild): string => {
        switch (child.parents) {
            case ParentRelationType.FIRST_PARENT:
                return getParentText(parents.firstParent)
            case ParentRelationType.SECOND_PARENT:
                return getParentText(parents.secondParent)
            case ParentRelationType.BOTH:
                return t('bothOfTheAbove', {
                    person1: getParentText(parents.firstParent),
                    person2: getParentText(parents.secondParent),
                })
            default:
                throw Error(`Unexpected parent relation: ${child.parents}`)
        }
    }

    const getParentText = ({ firstName, lastName, fnrDnr }: IParent): string => {
        return `${firstName} ${lastName} (f. ${fnrDnr.substring(0, 6)})`
    }

    return (
        <FormElement>
            <Accordion>
                <AccordionItem
                    title={isChild ? t('aboutSiblingsTitle') : t('aboutChildrenTitle')}
                    path={`/skjema/${pathPrefix}/${StepPath.AboutChildren}`}
                    pathText={t(StepLabelKey.AboutChildren, { ns: 'summary' })}
                >
                    {aboutChildren?.children?.map((child) => (
                        <Panel key={uuid()}>
                            <Heading size={'small'}>{`${child.firstName} ${child.lastName}`}</Heading>
                            <PersonInfoSummary
                                firstName={child.firstName}
                                lastName={child.lastName}
                                fnrDnr={child.fnrDnr}
                                citizenship={child.citizenship}
                            />
                            {child.staysAbroad?.answer && (
                                <TextGroupJaNeiVetIkke
                                    title={isChild ? t('doesTheSiblingLiveAbroad') : t('doesTheChildLiveAbroad')}
                                    content={child.staysAbroad?.answer}
                                />
                            )}
                            {child.staysAbroad?.answer === JaNeiVetIkke.JA && (
                                <>
                                    <TextGroup title={t('stayAbroadCountry')} content={child.staysAbroad?.country} />
                                    <TextGroup title={t('addressAbroad')} content={child.staysAbroad?.address} />
                                </>
                            )}
                            {child.parents && (
                                <TextGroup
                                    title={t('whoAreTheParents')}
                                    content={isParent ? parentAnswerText(child) : childOrGuardianAnswerText(child)}
                                />
                            )}
                            {child.childHasGuardianship && (
                                <>
                                    <TextGroupJaNeiVetIkke
                                        title={t('childHasGuardian')}
                                        content={child.childHasGuardianship?.answer}
                                    />
                                    <Panel>
                                        {child.childHasGuardianship.firstName && (
                                            <TextGroup
                                                title={t('guardianFirstName')}
                                                content={child.childHasGuardianship?.firstName}
                                            />
                                        )}
                                        {child.childHasGuardianship.lastName && (
                                            <TextGroup
                                                title={t('guardianLastName')}
                                                content={child.childHasGuardianship?.lastName}
                                            />
                                        )}
                                        {child.childHasGuardianship.fnr && (
                                            <TextGroup
                                                title={t('guardianFnr')}
                                                content={child.childHasGuardianship?.fnr}
                                            />
                                        )}
                                    </Panel>
                                </>
                            )}

                            {child.appliesForChildrensPension && (
                                <>
                                    <TextGroupJaNeiVetIkke
                                        title={t('userAppliesForChildrensPension')}
                                        content={JaNeiVetIkke.JA}
                                    />

                                    {child.paymentDetails && (
                                        <PaymentDetailsSummary paymentDetails={child.paymentDetails} />
                                    )}
                                </>
                            )}
                        </Panel>
                    ))}
                </AccordionItem>
            </Accordion>
        </FormElement>
    )
})
