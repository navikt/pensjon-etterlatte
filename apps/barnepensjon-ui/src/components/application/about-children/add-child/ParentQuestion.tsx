import { Alert, BodyLong, Box, VStack } from '@navikt/ds-react'
import { useApplicationContext } from '../../../../context/application/ApplicationContext'
import useTranslation from '../../../../hooks/useTranslation'
import { ApplicantRole, ApplicantSituation } from '../../../../types/applicant'
import { ParentRelationType } from '../../../../types/person'
import { nameAndFnr } from '../../../../utils/personalia'
import { RHFRadio } from '../../../common/rhf/RHFRadio'

interface Props {
    parents?: ParentRelationType
}

export default function ParentQuestion({ parents }: Props) {
    const { t } = useTranslation('aboutChildren')

    const { state: application } = useApplicationContext()

    const isParent = application.applicant?.applicantRole === ApplicantRole.PARENT
    const isGuardian = application.applicant?.applicantRole === ApplicantRole.GUARDIAN
    const oneParentsDeceased = application.applicant?.applicantSituation === ApplicantSituation.ONE_PARENT_DECEASED
    const hasUnknownParent = !!application.unknownParent

    const bothParents = () => {
        if (isParent) return t('jointChild', { person1: nameAndFnr(application.secondParent!) })
        if (isGuardian) {
            if (application.unknownParent) {
                return t('bothOfTheAbove', {
                    person1: t('unknownParent', { ns: 'aboutParents' }),
                    person2: nameAndFnr(application.firstParent!),
                })
            }
            if (oneParentsDeceased) return t('guardianChild', { person1: nameAndFnr(application.secondParent!) })
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
        if (isGuardian && oneParentsDeceased) return t('remainingParent')
        return nameAndFnr(application.firstParent!)
    }

    return (
        <VStack marginBlock="4" gap="4">
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

            {!!parents && ParentRelationType.FIRST_PARENT === parents && (
                <Box padding="4" borderWidth="1" borderRadius="small">
                    <Alert inline={true} variant={'info'}>
                        {(isParent ||
                            ApplicantSituation.ONE_PARENT_DECEASED === application.applicant?.applicantSituation) && (
                            <BodyLong>{t('onlyChildrenOfDeceasedHaveRights')}</BodyLong>
                        )}
                        {ApplicantSituation.BOTH_PARENTS_DECEASED === application.applicant?.applicantSituation && (
                            <BodyLong>{t('onlyParentOrGuardianCanApply')}</BodyLong>
                        )}
                    </Alert>
                </Box>
            )}

            {!!parents && ParentRelationType.SECOND_PARENT === parents && (
                <Box padding="4" borderWidth="1" borderRadius="small">
                    <Alert inline={true} variant={'info'}>
                        {isParent ? (
                            <BodyLong>{t('onlyParentOrGuardianCanApplyOnLivingParent')}</BodyLong>
                        ) : (
                            <BodyLong>{t('onlyParentOrGuardianCanApply')}</BodyLong>
                        )}
                    </Alert>
                </Box>
            )}
        </VStack>
    )
}
