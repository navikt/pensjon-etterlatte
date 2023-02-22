import FormElement from '../../../common/FormElement'
import { RHFRadio } from '../../../common/rhf/RHFRadio'
import { Alert, BodyLong, HelpText, Label, Panel } from '@navikt/ds-react'
import useTranslation from '../../../../hooks/useTranslation'
import { useApplicationContext } from '../../../../context/application/ApplicationContext'
import FormGroup from '../../../common/FormGroup'
import { ParentRelationType } from '../../../../types/person'
import { ApplicantRole, ApplicantSituation } from '../../scenario/ScenarioSelection'
import { nameAndFnr } from '../../../../utils/personalia'
import styled from 'styled-components'

interface Props {
    parents?: ParentRelationType
}

const HelpTextLabel = styled.div`
    .navds-label {
        display: flex;
    }
`

export default function ParentQuestion({ parents }: Props) {
    const { t } = useTranslation('aboutChildren')

    const { state: application } = useApplicationContext()

    const isParent = application.applicant?.applicantRole === ApplicantRole.PARENT

    return (
        <FormGroup>
            <FormElement>
                <RHFRadio
                    legend={
                        <HelpTextLabel>
                            <Label as={'span'}>
                                {t('whoAreTheParents')}&nbsp;
                                {isParent && <HelpText placement={'top'}>{t('whoAreTheParentsHelpText')}</HelpText>}
                            </Label>
                        </HelpTextLabel>
                    }
                    name={'parents'}
                    children={[
                        {
                            children: isParent
                                ? t('jointChild', { person1: nameAndFnr(application.secondParent!) })
                                : t('bothOfTheAbove', {
                                      person1: nameAndFnr(application.firstParent!),
                                      person2: nameAndFnr(application.secondParent!),
                                  }),
                            value: ParentRelationType.BOTH,
                            required: true,
                        },
                        {
                            children: isParent ? t('remainingParentsChild') : nameAndFnr(application.firstParent!),
                            value: ParentRelationType.FIRST_PARENT,
                            required: true,
                        },
                        {
                            children: nameAndFnr(application.secondParent!),
                            value: ParentRelationType.SECOND_PARENT,
                            required: true,
                        },
                    ]}
                />
            </FormElement>

            {!!parents && ParentRelationType.FIRST_PARENT === parents && (
                <Panel border>
                    <Alert inline={true} variant={'info'}>
                        {(isParent ||
                            ApplicantSituation.ONE_PARENT_DECEASED === application.applicant?.applicantSituation) && (
                            <BodyLong>{t('onlyChildrenOfDeceasedHaveRights')}</BodyLong>
                        )}
                        {ApplicantSituation.BOTH_PARENTS_DECEASED === application.applicant?.applicantSituation && (
                            <BodyLong>{t('onlyParentOrGuardianCanApply')}</BodyLong>
                        )}
                    </Alert>
                </Panel>
            )}

            {!!parents && ParentRelationType.SECOND_PARENT === parents && (
                <Panel border>
                    <Alert inline={true} variant={'info'}>
                        {isParent ? (
                            <BodyLong>{t('onlyParentOrGuardianCanApplyOnLivingParent')}</BodyLong>
                        ) : (
                            <BodyLong>{t('onlyParentOrGuardianCanApply')}</BodyLong>
                        )}
                    </Alert>
                </Panel>
            )}
        </FormGroup>
    )
}
