import { RadioProps } from '@navikt/ds-react'
import { FormProvider, useForm } from 'react-hook-form'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import { useApplicationContext } from '~context/application/ApplicationContext'
import { ActionTypes } from '~context/application/application'
import { LogEvents, useAnalytics } from '~hooks/useAnalytics'
import { ApplicationReasonType, EducationType, ISituationChild } from '~types/situation'
import useTranslation from '../../../hooks/useTranslation'
import ErrorSummaryWrapper from '../../common/ErrorSummaryWrapper'
import FormElement from '../../common/FormElement'
import FormGroup from '../../common/FormGroup'
import Navigation from '../../common/Navigation'
import { RHFCheckboksGruppe } from '../../common/rhf/RHFCheckboksPanelGruppe'
import { RHFGeneralQuestionRadio, RHFInlineRadio } from '../../common/rhf/RHFRadio'
import StepHeading from '../../common/StepHeading'
import { StepProps } from '../Dialogue'

export default function YourSituation({ next, prev }: StepProps) {
    const { state, dispatch } = useApplicationContext()
    const { t } = useTranslation('yourSituation')
    const { logEvent } = useAnalytics()

    const save = (data: ISituationChild) => {
        dispatch({ type: ActionTypes.UPDATE_YOUR_SITUATION, payload: { ...data } })
        next!()
    }

    const logErrors = (data: FieldErrors<ISituationChild>) => {
        Object.keys(data).map((error) =>
            logEvent(LogEvents.VALIDATION_ERROR, { skjemanavn: 'YourSituation', id: error })
        )
    }

    const methods = useForm<ISituationChild>({
        defaultValues: { ...state.yourSituation },
        shouldUnregister: true,
    })

    const {
        handleSubmit,
        formState: { errors },
    } = methods

    return (
        <FormProvider {...methods}>
            <form>
                <StepHeading>{t('title')}</StepHeading>

                <FormElement>
                    <RHFCheckboksGruppe
                        name={`whyDoYouApply`}
                        legend={t('whyDoYouApply')}
                        required={true}
                        checkboxes={[
                            {
                                children: t(ApplicationReasonType.EDUCATION),
                                value: ApplicationReasonType.EDUCATION,
                            },
                            {
                                children: t(ApplicationReasonType.APPRENTICE),
                                value: ApplicationReasonType.APPRENTICE,
                            },
                            {
                                children: t(ApplicationReasonType.INTERNSHIP),
                                value: ApplicationReasonType.INTERNSHIP,
                            },
                        ]}
                    />
                </FormElement>

                <FormElement>
                    <RHFInlineRadio
                        name={'timeUsedForEducation'}
                        legend={t('timeUsedForEducation')}
                        children={Object.values(EducationType).map((value) => {
                            return { children: t(value), value } as RadioProps
                        })}
                    />
                </FormElement>
                <FormGroup>
                    <FormElement>
                        <RHFGeneralQuestionRadio name={'doYouHaveIncome'} legend={t('doYouHaveIncome')} />
                    </FormElement>
                </FormGroup>
                <ErrorSummaryWrapper errors={errors} />

                <Navigation right={{ onClick: handleSubmit(save, logErrors) }} left={{ onClick: prev }} />
            </form>
        </FormProvider>
    )
}
