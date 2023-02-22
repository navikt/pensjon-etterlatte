import { RadioProps } from 'nav-frontend-skjema'
import { FormProvider, useForm } from 'react-hook-form'
import { ActionTypes } from '../../../context/application/application'
import { useApplicationContext } from '../../../context/application/ApplicationContext'
import useTranslation from '../../../hooks/useTranslation'
import { ApplicationReasonType, EducationType, ISituationChild } from '../../../types/situation'
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

    const save = (data: ISituationChild) => {
        dispatch({ type: ActionTypes.UPDATE_YOUR_SITUATION, payload: { ...data } })
        next!!()
    }

    const methods = useForm<ISituationChild>({
        defaultValues: { ...state.yourSituation } || {},
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
                        checkboxes={[
                            {
                                children: t(ApplicationReasonType.EDUCATION),
                                value: ApplicationReasonType.EDUCATION,
                                required: true,
                            },
                            {
                                children: t(ApplicationReasonType.APPRENTICE),
                                value: ApplicationReasonType.APPRENTICE,
                                required: true,
                            },
                            {
                                children: t(ApplicationReasonType.INTERNSHIP),
                                value: ApplicationReasonType.INTERNSHIP,
                                required: true,
                            },
                        ]}
                    />
                </FormElement>

                <FormElement>
                    <RHFInlineRadio
                        name={'timeUsedForEducation'}
                        legend={t('timeUsedForEducation')}
                        radios={Object.values(EducationType).map((value) => {
                            return { label: t(value), value } as RadioProps
                        })}
                    />
                </FormElement>
                <FormGroup>
                    <FormElement>
                        <RHFGeneralQuestionRadio name={'doYouHaveIncome'} legend={t('doYouHaveIncome')} />
                    </FormElement>
                </FormGroup>
                <ErrorSummaryWrapper errors={errors} />

                <Navigation right={{ onClick: handleSubmit(save) }} left={{ onClick: prev }} />
            </form>
        </FormProvider>
    )
}
