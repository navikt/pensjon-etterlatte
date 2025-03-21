import { Heading, Panel } from '@navikt/ds-react'
import { isEmpty } from 'lodash'
import { memo } from 'react'
import { v4 as uuid } from 'uuid'
import { JaNeiVetIkke } from '../../../../api/dto/FellesOpplysninger'
import useTranslation from '../../../../hooks/useTranslation'
import { IAboutChildren, IChild, ParentRelationType } from '../../../../types/person'
import { StepLabelKey, StepPath } from '../../../../utils/steps'
import { AccordionItem } from '../AccordionItem'
import { TextGroup, TextGroupJaNeiVetIkke } from '../TextGroup'
import PaymentDetailsSummary from './PaymentDetailsSummary'
import PersonInfoSummary from './PersonInfoSummary'
import { nameAndFnr } from '../../../../utils/personalia'
import { ApplicantRole, ApplicantSituation } from '../../../../types/applicant'
import { IDeceasedParent, IParent } from '~context/application/application'

interface Props {
    aboutChildren?: IAboutChildren
    pathPrefix: string
    applicationRole?: ApplicantRole
    applicantSituation?: ApplicantSituation
    parents: {
        firstParent: IParent | IDeceasedParent | undefined
        secondParent: IParent | IDeceasedParent | undefined
    }
    unknownParent: boolean
}

export const SummaryAboutChildren = memo(
    ({ aboutChildren, pathPrefix, applicationRole, applicantSituation, parents, unknownParent }: Props) => {
        const { t } = useTranslation('aboutChildren')

        if (!aboutChildren || isEmpty(aboutChildren)) return null

        const isParent = applicationRole === ApplicantRole.PARENT
        const isChild = applicationRole === ApplicantRole.CHILD
        const oneParentDeceased = applicantSituation === ApplicantSituation.ONE_PARENT_DECEASED

        const parentAnswerText = (child: IChild): string => {
            switch (child.parents) {
                case ParentRelationType.FIRST_PARENT:
                    return t('remainingParentsChild')
                case ParentRelationType.SECOND_PARENT:
                    return t('deceasedParentsChild')
                case ParentRelationType.BOTH:
                    return t('jointChild', { person1: nameAndFnr(parents.secondParent!) })
                default:
                    throw Error(`Unexpected parent relation: ${child.parents}`)
            }
        }

        const childOrGuardianAnswerText = (child: IChild): string => {
            switch (child.parents) {
                case ParentRelationType.FIRST_PARENT:
                    return t('remainingParent')
                case ParentRelationType.SECOND_PARENT:
                    if (unknownParent) return t('unknownParent', { ns: 'aboutParents' })
                    return nameAndFnr(parents.secondParent!)
                case ParentRelationType.BOTH:
                    if (unknownParent)
                        return t('bothOfTheAbove', {
                            person1: t('unknownParent', { ns: 'aboutParents' }),
                            person2: nameAndFnr(parents.firstParent!),
                        })
                    return t('bothOfTheAbove', {
                        person1: oneParentDeceased ? t('remainingParent') : nameAndFnr(parents.firstParent!),
                        person2: nameAndFnr(parents.secondParent!),
                    })
                default:
                    throw Error(`Unexpected parent relation: ${child.parents}`)
            }
        }

        return (
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
                            dateOfBirth={child.dateOfBirth}
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
                                        <TextGroup title={t('guardianFnr')} content={child.childHasGuardianship?.fnr} />
                                    )}
                                </Panel>
                            </>
                        )}

                        {child.disabilityBenefitsIsGuardian && (
                            <TextGroupJaNeiVetIkke
                                title={t('disabilityBenefitsIsGuardian')}
                                content={child.disabilityBenefitsIsGuardian}
                            />
                        )}

                        {child.disabilityBenefitsIsGuardian && (
                            <TextGroupJaNeiVetIkke
                                title={t('disabilityBenefitsIsGuardian')}
                                content={child.disabilityBenefitsIsGuardian}
                            />
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
        )
    }
)
