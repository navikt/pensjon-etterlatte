import FormElement from '../../../common/FormElement'
import { RHFRadio } from '../../../common/rhf/RHFRadio'
import { Alert, BodyLong, Panel } from '@navikt/ds-react'
import useTranslation from '../../../../hooks/useTranslation'
import { useApplicationContext } from '../../../../context/application/ApplicationContext'
import { ParentRelationType } from '../../../../types/person'
import { ApplicantRole, ApplicantSituation } from '../../scenario/ScenarioSelection'
import { nameAndFnr } from '../../../../utils/personalia'

interface Props {
    parents?: ParentRelationType
}

export default function ParentQuestion({ parents }: Props) {
    const { t } = useTranslation('aboutChildren')

    const { state: application } = useApplicationContext()

    const isParent = application.applicant?.applicantRole === ApplicantRole.PARENT
    const isGuardian = application.applicant?.applicantRole === ApplicantRole.GUARDIAN
    const hasUnknownParent = !!application.unknownParent

    const bothParents = () => {
        if (isParent) return t('jointChild', { person1: nameAndFnr(application.secondParent!) })
        if (isGuardian) {
            console.log(application.unknownParent)
            if (application.unknownParent) return t('guardianChild', { person1: nameAndFnr(application.firstParent!) })
            return t('guardianChild', { person1: nameAndFnr(application.secondParent!) })
        }
        return t('bothOfTheAbove', {
            person1: nameAndFnr(application.firstParent!),
            person2: hasUnknownParent
                ? t('unknownParent', { ns: 'aboutParents' })
                : nameAndFnr(application.secondParent!),
        })
    }

    const remainingParent = () => {
        if (isParent) return t('remainingParentsChild')
        if (isGuardian) return t('remainingParent')
        else nameAndFnr(application.firstParent!)
    }

    return (
        <FormElement>
            <FormElement>
                <RHFRadio
                    legend={t('whoAreTheParents')}
                    description={isParent && t('whoAreTheParentsHelpText')}
                    name={'parents'}
                    children={[
                        {
                            children: bothParents(),
                            value: ParentRelationType.BOTH,
                            required: true,
                        },
                        {
                            children: remainingParent(),
                            value: ParentRelationType.FIRST_PARENT,
                            required: true,
                        },
                        {
                            children: hasUnknownParent
                                ? t('unknownParent', { ns: 'aboutParents' })
                                : nameAndFnr(application.secondParent!),
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
        </FormElement>
    )
}
