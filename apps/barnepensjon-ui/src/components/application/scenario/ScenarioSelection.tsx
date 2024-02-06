import { BodyLong, Button, GuidePanel, Heading, Label, RadioProps } from '@navikt/ds-react'
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
                        <Label spacing>{t('parentApplicantInformationLabel')}</Label>
                        <BodyLong size={'small'}>{t('parentApplicantInformation')}</BodyLong>
                        <FormElement>
                            <Trans value={t('youNeedFnrForEveryoneInThisApplicationSurvivingParent')} />
                        </FormElement>
                    </FormGroup>
                    <FormGroup>
                        <GuidePanel>
                            <Heading size={'medium'} spacing>
                                {t('aboutSurvivorsPensionTitle')}
                            </Heading>
                            <BodyLong>
                                <Trans value={t('aboutSurvivorsPensionDescription')} />
                            </BodyLong>
                        </GuidePanel>
                    </FormGroup>
                </>
            )}

            {ApplicantRole.GUARDIAN === selectedRole && (
                <>
                    <FormGroup>
                        <Label spacing>{t('guardianApplicantInformationLabel')}</Label>
                        <BodyLong spacing size={'small'}>
                            {t('guardianApplicantInformation')}
                        </BodyLong>
                        <BodyLong size={'small'}>
                            <Trans value={t('guardiansMustSendDocumentation')} />
                        </BodyLong>
                    </FormGroup>
                    <FormGroup>
                        <RHFRadio
                            legend={t('additionalSituationDetails')}
                            name={'applicantSituation'}
                            description={t('additionalSituationDetailsDescription')}
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
                </>
            )}

            {ApplicantRole.CHILD === selectedRole && (
                <>
                    <FormGroup>
                        <Label spacing>{t('CHILD')}</Label>
                        <BodyLong size={'small'}>
                            <Trans value={t('over18WithoutFnr')} />
                        </BodyLong>
                    </FormGroup>
                    <FormGroup>
                        <RHFRadio
                            legend={t('additionalSituationDetailsOver18')}
                            name={'applicantSituation'}
                            description={t('additionalSituationDetailsOver18Description')}
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
                </>
            )}

            <ErrorSummaryWrapper errors={errors} />

            <FormGroup>
                <Button onClick={handleSubmit(next)}>{t('continueButton', { ns: 'btn' })}</Button>
            </FormGroup>
        </FormProvider>
    )
}
