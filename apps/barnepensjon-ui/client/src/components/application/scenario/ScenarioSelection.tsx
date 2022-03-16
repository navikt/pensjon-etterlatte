import { Alert, BodyLong, Button, Heading, Link } from '@navikt/ds-react'
import { RadioProps } from 'nav-frontend-skjema'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { ActionTypes, IApplicant } from '../../../context/application/application'
import { useApplicationContext } from '../../../context/application/ApplicationContext'
import useTranslation from '../../../hooks/useTranslation'
import ErrorSummaryWrapper from '../../common/ErrorSummaryWrapper'
import FormGroup from '../../common/FormGroup'
import { RHFRadio } from '../../common/rhf/RHFRadio'

export enum ApplicantRole {
    PARENT = 'PARENT',
    GUARDIAN = 'GUARDIAN',
    CHILD = 'CHILD',
}

export enum ApplicantSituation {
    ONE_PARENT_DECEASED = 'ONE_PARENT_DECEASED',
    BOTH_PARENTS_DECEASED = 'BOTH_PARENTS_DECEASED',
}

export default function ScenarioSelection() {
    const navigate = useNavigate()
    const { t } = useTranslation('selectScenario')
    const { dispatch } = useApplicationContext()

    const methods = useForm<IApplicant>({
        defaultValues: {},
        shouldUnregister: true,
    })

    const {
        handleSubmit,
        watch,
        formState: { errors },
    } = methods

    function next(data: any) {
        dispatch({ type: ActionTypes.UPDATE_APPLICANT, payload: data })

        if (data.applicantRole === ApplicantRole.PARENT) navigate('/skjema/forelder/steg/om-deg')
        else if (data.applicantRole === ApplicantRole.GUARDIAN) navigate('/skjema/verge/steg/om-deg')
        else if (data.applicantRole === ApplicantRole.CHILD) navigate('/skjema/barn/steg/om-deg')
    }

    const selectedRole = watch('applicantRole')
    const situation = watch('applicantSituation')

    return (
        <FormProvider {...methods}>
            <FormGroup>
                <Heading size={'small'}>{t('selectSituationToContinue')}</Heading>
            </FormGroup>

            <FormGroup>
                <RHFRadio
                    legend={t('whoIsApplying')}
                    name={'applicantRole'}
                    radios={Object.values(ApplicantRole).map((value) => {
                        return { label: t(value), value, required: true } as RadioProps
                    })}
                />
            </FormGroup>

            {[ApplicantRole.GUARDIAN, ApplicantRole.PARENT].includes(selectedRole) && (
                <FormGroup>
                    <BodyLong size={'small'}>{t('parentApplicantInformation')}</BodyLong>
                </FormGroup>
            )}

            {selectedRole === ApplicantRole.PARENT && (
                <FormGroup>
                    <Alert variant={'info'} inline={true}>
                        <Heading size={'small'}>{t('aboutSurvivorsPensionTitle')}</Heading>
                        <BodyLong>
                            {t('aboutSurvivorsPensionDescription')}&nbsp;
                            <Link href={t('aboutSurvivorsPensionHref')}>{t('aboutSurvivorsPensionLink')}</Link>
                        </BodyLong>
                    </Alert>
                </FormGroup>
            )}

            {[ApplicantRole.GUARDIAN, ApplicantRole.CHILD].includes(selectedRole) && (
                <FormGroup>
                    <RHFRadio
                        legend={t('additionalSituationDetails')}
                        name={'applicantSituation'}
                        radios={[
                            {
                                label: t(ApplicantSituation.ONE_PARENT_DECEASED),
                                value: ApplicantSituation.ONE_PARENT_DECEASED,
                                required: true,
                            },
                            {
                                label:
                                    selectedRole === ApplicantRole.CHILD
                                        ? t('BOTH_PARENTS_DECEASED_CHILD_APPLICANT')
                                        : t(ApplicantSituation.BOTH_PARENTS_DECEASED),
                                value: ApplicantSituation.BOTH_PARENTS_DECEASED,
                                required: true,
                            },
                        ]}
                    />
                </FormGroup>
            )}

            {!!situation && selectedRole === ApplicantRole.CHILD && (
                <FormGroup>
                    <Alert variant={'info'} inline={true}>
                        {situation === ApplicantSituation.ONE_PARENT_DECEASED && (
                            <>
                                <BodyLong spacing size={'small'}>
                                    {t('childApplicantInformation1')}
                                </BodyLong>
                            </>
                        )}
                        <BodyLong size={'small'}>{t('childApplicantInformation2')}</BodyLong>
                    </Alert>
                </FormGroup>
            )}

            <ErrorSummaryWrapper errors={errors} />

            <FormGroup>
                <Button onClick={handleSubmit(next)}>Fortsett</Button>
            </FormGroup>
        </FormProvider>
    )
}
