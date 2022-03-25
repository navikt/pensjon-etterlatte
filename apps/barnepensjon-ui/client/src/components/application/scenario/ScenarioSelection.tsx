import { Alert, BodyLong, Button, Heading } from '@navikt/ds-react'
import { RadioProps } from 'nav-frontend-skjema'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { ActionTypes, IApplicant } from '../../../context/application/application'
import { useApplicationContext } from '../../../context/application/ApplicationContext'
import useTranslation from '../../../hooks/useTranslation'
import ErrorSummaryWrapper from '../../common/ErrorSummaryWrapper'
import FormGroup from '../../common/FormGroup'
import { RHFRadio } from '../../common/rhf/RHFRadio'
import Trans from '../../common/Trans'
import { LogEvents, useAmplitude } from '../../../hooks/useAmplitude'

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
    const { logEvent } = useAmplitude()

    const methods = useForm<IApplicant>({
        defaultValues: {},
        shouldUnregister: true,
    })

    const {
        handleSubmit,
        watch,
        formState: { errors },
    } = methods

    function next(data: IApplicant) {
        dispatch({ type: ActionTypes.UPDATE_APPLICANT, payload: data })

        logEvent(LogEvents.SELECT_SCENARIO, { type: data.applicantRole })
        logEvent(LogEvents.SELECT_SITUATION, { type: data.applicantSituation })

        if (data.applicantRole === ApplicantRole.PARENT) navigate('/skjema/forelder/steg/om-deg')
        else if (data.applicantRole === ApplicantRole.GUARDIAN) navigate('/skjema/verge/steg/om-deg')
        else if (data.applicantRole === ApplicantRole.CHILD) navigate('/skjema/barn/steg/om-deg')
    }

    const selectedRole = watch('applicantRole')

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

            {[ApplicantRole.PARENT].includes(selectedRole) && (
                <FormGroup>
                    <BodyLong size={'small'}>{t('parentApplicantInformation')}</BodyLong>
                </FormGroup>
            )}

            {[ApplicantRole.GUARDIAN].includes(selectedRole) && (
                <FormGroup>
                    <BodyLong size={'small'}>{t('guardianApplicantInformation')}</BodyLong>
                </FormGroup>
            )}

            {selectedRole === ApplicantRole.PARENT && (
                <FormGroup>
                    <Alert variant={'info'} inline={true}>
                        <BodyLong>
                            <Trans value={t('aboutSurvivorsPensionDescription')} />
                        </BodyLong>
                    </Alert>
                </FormGroup>
            )}

            {ApplicantRole.GUARDIAN === selectedRole && (
                <>
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
                                    label: t(ApplicantSituation.BOTH_PARENTS_DECEASED),
                                    value: ApplicantSituation.BOTH_PARENTS_DECEASED,
                                    required: true,
                                },
                            ]}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Alert variant={'info'} inline={true}>
                            <BodyLong>
                                <Trans value={t('childApplicantInformationFatherNotConfirmed')} />
                            </BodyLong>
                        </Alert>
                    </FormGroup>
                </>
            )}

            {selectedRole === ApplicantRole.CHILD && (
                <>
                    <FormGroup>
                        <BodyLong spacing size={'small'}>
                            <Trans value={t('childApplicantInformation1')} />
                        </BodyLong>
                        <BodyLong spacing size={'small'}>
                            <Trans value={t('childApplicantInformation2')} />
                        </BodyLong>
                        <BodyLong size={'small'}>
                            <Trans value={t('childApplicantInformationOver18')} />
                        </BodyLong>
                    </FormGroup>
                    <FormGroup>
                        <Alert variant={'info'} inline={true}>
                            <Trans value={t('childApplicantInformationFatherNotConfirmed')} />
                        </Alert>
                    </FormGroup>
                </>
            )}

            <ErrorSummaryWrapper errors={errors} />

            {selectedRole !== ApplicantRole.CHILD && (
                <FormGroup>
                    <Button onClick={handleSubmit(next)}>Fortsett</Button>
                </FormGroup>
            )}
        </FormProvider>
    )
}
