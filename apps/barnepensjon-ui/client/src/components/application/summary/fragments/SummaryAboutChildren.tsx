import { Accordion, Heading, Panel } from '@navikt/ds-react'
import { isEmpty } from 'lodash'
import { memo } from 'react'
import { v4 as uuid } from 'uuid'
import { JaNeiVetIkke } from '../../../../api/dto/FellesOpplysninger'
import { IParent } from '../../../../context/application/application'
import useTranslation from '../../../../hooks/useTranslation'
import { IAboutChild } from '../../../../types/person'
import { StepPath } from '../../../../types/steps'
import FormElement from '../../../common/FormElement'
import { ApplicantRole } from '../../scenario/ScenarioSelection'
import { AccordionItem } from '../AccordionItem'
import TextGroup from '../TextGroup'
import { PaymentDetailsSummary } from './PaymentDetailsSummary'
import { PersonInfoSummary } from './PersonInfoSummery'

export const SummaryAboutChildren = memo(
    ({
        aboutChildren,
        pathPrefix,
        applicationRole,
        parents,
    }: {
        aboutChildren: IAboutChild
        pathPrefix: string
        applicationRole?: ApplicantRole
        parents: { firstParent: any; secondParent: any }
    }) => {
        const { t } = useTranslation('aboutChildren')

        const isParent = applicationRole === ApplicantRole.PARENT
        const isChild = applicationRole === ApplicantRole.CHILD

        const bothParentsText = (): string => {
            if (!isParent) {
                return t('childBelongsToParents', {
                    forelder1: getParentText(parents.firstParent!),
                    forelder2: getParentText(parents.secondParent!),
                })
            } else return t('youAndDeceasedAreTheParents')
        }

        const getParentText = (parent: IParent): string => {
            return `${parent.firstName} ${parent.lastName} (f. ${parent.fnrDnr.substring(0, 6)})`
        }

        return (
            <>
                {!isEmpty(aboutChildren) && (
                    <FormElement>
                        <Accordion>
                            <AccordionItem
                                title={isChild ? t('aboutSiblingsTitle') : t('aboutChildrenTitle')}
                                path={`/skjema/${pathPrefix}/steg/${StepPath.AboutChildren}`}
                                pathText={t(`changeAnswerSummary.${StepPath.AboutChildren}`)}
                            >
                                {aboutChildren.child &&
                                    aboutChildren?.child.map((child) => (
                                        <Panel key={uuid()}>
                                            <Heading size={'small'}>{`${child.firstName} ${child.lastName}`}</Heading>
                                            <PersonInfoSummary
                                                firstName={child.firstName}
                                                lastName={child.lastName}
                                                fnrDnr={child.fnrDnr}
                                                citizenship={child.citizenship}
                                            />
                                            <TextGroup
                                                title={t('staysAbroad.answer')}
                                                content={child.staysAbroad?.answer}
                                            />
                                            {child.staysAbroad?.answer === JaNeiVetIkke.JA && (
                                                <>
                                                    <TextGroup
                                                        title={t('staysAbroad.country')}
                                                        content={child.staysAbroad?.country}
                                                    />
                                                    <TextGroup
                                                        title={t('staysAbroad.address')}
                                                        content={child.staysAbroad?.address}
                                                    />
                                                </>
                                            )}
                                            {child.bothParents && (
                                                <TextGroup title={bothParentsText()} content={child.bothParents} />
                                            )}
                                            {child.childHasGuardianship && (
                                                <>
                                                    <TextGroup
                                                        title={t('childHasGuardianship.answer')}
                                                        content={child.childHasGuardianship?.answer}
                                                    />
                                                    <Panel>
                                                        {child.childHasGuardianship.firstName && (
                                                            <TextGroup
                                                                title={t('childHasGuardianship.firstName')}
                                                                content={child.childHasGuardianship?.firstName}
                                                            />
                                                        )}
                                                        {child.childHasGuardianship.lastName && (
                                                            <TextGroup
                                                                title={t('childHasGuardianship.lastName')}
                                                                content={child.childHasGuardianship?.lastName}
                                                            />
                                                        )}
                                                        {child.childHasGuardianship.fnr && (
                                                            <TextGroup
                                                                title={t('childHasGuardianship.fnr')}
                                                                content={child.childHasGuardianship?.fnr}
                                                            />
                                                        )}
                                                    </Panel>
                                                </>
                                            )}
                                            {child.childrensPension && (
                                                <>
                                                    <TextGroup
                                                        title={t('userAppliesForChildrensPension')}
                                                        content={child.childrensPension.applies}
                                                    />
                                                    <Panel>
                                                        <PaymentDetailsSummary
                                                            accountType={
                                                                child.childrensPension.paymentDetails?.accountType
                                                            }
                                                            bankAccount={
                                                                child.childrensPension.paymentDetails?.bankAccount
                                                            }
                                                            foreignBankName={
                                                                child.childrensPension.paymentDetails?.foreignBankName
                                                            }
                                                            foreignBankAddress={
                                                                child.childrensPension.paymentDetails
                                                                    ?.foreignBankAddress
                                                            }
                                                            iban={child.childrensPension.paymentDetails?.iban}
                                                            swift={child.childrensPension.paymentDetails?.swift}
                                                            taxWithholdAnswer={
                                                                child.childrensPension.paymentDetails?.taxWithhold
                                                                    ?.answer
                                                            }
                                                            taxWithholdPercentage={
                                                                child.childrensPension.paymentDetails?.taxWithhold
                                                                    ?.taxPercentage
                                                            }
                                                        />
                                                    </Panel>
                                                </>
                                            )}
                                        </Panel>
                                    ))}
                            </AccordionItem>
                        </Accordion>
                    </FormElement>
                )}
            </>
        )
    }
)
