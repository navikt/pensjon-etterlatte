import FormElement from '../../../common/FormElement'
import { RHFRadio } from '../../../common/rhf/RHFRadio'
import { Alert, BodyLong, Panel } from '@navikt/ds-react'
import useTranslation from '../../../../hooks/useTranslation'
import { useApplicationContext } from '../../../../context/application/ApplicationContext'
import FormGroup from '../../../common/FormGroup'
import { ParentRelationType } from '../../../../types/person'
import { ApplicantRole } from '../../scenario/ScenarioSelection'
import { nameAndFnr } from '../../../../utils/personalia'

interface Props {
    parents?: ParentRelationType
}

export default function ParentQuestion({ parents }: Props) {
    const { t } = useTranslation('aboutChildren')

    const { state: application } = useApplicationContext()

    const isParent = application.applicant?.applicantRole === ApplicantRole.PARENT

    return (
        <FormGroup>
            <FormElement>
                <RHFRadio
                    legend={t('whoAreTheParents')}
                    name={'parents'}
                    radios={[
                        {
                            label: isParent
                                ? t('jointChild')
                                : t('bothOfTheAbove', {
                                      person1: nameAndFnr(application.firstParent!),
                                      person2: nameAndFnr(application.secondParent!),
                                  }),
                            value: ParentRelationType.BOTH,
                            required: true,
                        },
                        {
                            label: isParent ? t('remainingParentsChild') : nameAndFnr(application.firstParent!),
                            value: ParentRelationType.FIRST_PARENT,
                            required: true,
                        },
                        {
                            label: isParent ? t('deceasedParentsChild') : nameAndFnr(application.secondParent!),
                            value: ParentRelationType.SECOND_PARENT,
                            required: true,
                        },
                    ]}
                />
            </FormElement>

            {isParent && ParentRelationType.FIRST_PARENT === parents && (
                <Panel border>
                    <Alert inline={true} variant={'info'}>
                        <BodyLong>{t('onlyChildrenOfDeceasedHaveRights')}</BodyLong>
                    </Alert>
                </Panel>
            )}

            {isParent && ParentRelationType.SECOND_PARENT === parents && (
                <Panel border>
                    <Alert inline={true} variant={'info'}>
                        <BodyLong>{t('onlyParentOrGuardianCanApply')}</BodyLong>
                    </Alert>
                </Panel>
            )}

            {!isParent &&
                !!parents &&
                [ParentRelationType.FIRST_PARENT, ParentRelationType.SECOND_PARENT].includes(parents) && (
                    <Panel border>
                        <Alert inline={true} variant={'info'}>
                            <BodyLong>{t('onlyJointChildrenNecessary')}</BodyLong>
                        </Alert>
                    </Panel>
                )}
        </FormGroup>
    )
}
