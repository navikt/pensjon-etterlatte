import { Alert, BodyLong, Button, RadioProps } from '@navikt/ds-react'
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
import FormElement from '../../common/FormElement'

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
    const applicantSituation = watch('applicantSituation')

    return (
        <FormProvider {...methods}>
            <FormGroup>
                <RHFRadio
                    legend={t('whoIsApplying')}
                    name={'applicantRole'}
                    children={Object.values(ApplicantRole).map((value) => {
                        return { children: t(value), value, required: true } as RadioProps
                    })}
                />
            </FormGroup>

            {ApplicantRole.PARENT === selectedRole && (
                <>
                    <FormGroup>
                        <BodyLong size={'small'}>{t('parentApplicantInformation')}</BodyLong>
                        <FormElement>
                            <Trans value={t('youNeedFnrForEveryoneInThisApplicationSurvivingParent')} />
                        </FormElement>
                    </FormGroup>
                    <FormGroup>
                        <Alert variant={'info'} inline={true}>
                            <BodyLong>
                                <Trans value={t('aboutSurvivorsPensionDescription')} />
                            </BodyLong>
                        </Alert>
                    </FormGroup>
                </>
            )}

            {ApplicantRole.GUARDIAN === selectedRole && (
                <>
                    <FormGroup>
                        <BodyLong spacing size={'small'}>
                            {t('guardianApplicantInformation')}
                        </BodyLong>
                        <BodyLong size={'small'}>{t('guardiansMustSendDocumentation')}</BodyLong>
                    </FormGroup>
                    <FormGroup>
                        <RHFRadio
                            legend={t('additionalSituationDetails')}
                            name={'applicantSituation'}
                            children={[
                                {
                                    children: t(ApplicantSituation.ONE_PARENT_DECEASED),
                                    value: ApplicantSituation.ONE_PARENT_DECEASED,
                                    required: true,
                                },
                                {
                                    children: t(ApplicantSituation.BOTH_PARENTS_DECEASED),
                                    value: ApplicantSituation.BOTH_PARENTS_DECEASED,
                                    required: true,
                                },
                            ]}
                        />
                    </FormGroup>

                    {ApplicantSituation.ONE_PARENT_DECEASED === applicantSituation && (
                        <BodyLong spacing size={'small'}>
                            <Trans value={t('youNeedFnrForEveryoneInThisApplicationOneParentDeceased')} />
                        </BodyLong>
                    )}
                    {ApplicantSituation.BOTH_PARENTS_DECEASED === applicantSituation && (
                        <BodyLong spacing size={'small'}>
                            <Trans value={t('youNeedFnrForEveryoneInThisApplicationBothParentsDeceased')} />
                        </BodyLong>
                    )}
                    <FormGroup>
                        <Alert variant={'info'}>
                            <Trans value={t('guardianApplicantInformationFatherNotConfirmed')} />
                        </Alert>
                    </FormGroup>
                </>
            )}

            {ApplicantRole.CHILD === selectedRole && (
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
                </>
            )}

            <ErrorSummaryWrapper errors={errors} />

            {ApplicantRole.CHILD !== selectedRole && (
                <FormGroup>
                    <Button onClick={handleSubmit(next)}>{t('continueButton', { ns: 'btn' })}</Button>
                </FormGroup>
            )}
        </FormProvider>
    )
}
