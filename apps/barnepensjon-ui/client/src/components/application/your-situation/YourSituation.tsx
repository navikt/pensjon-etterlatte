import { RadioProps } from 'nav-frontend-skjema'
import { FormProvider, useForm } from 'react-hook-form'
import { ActionTypes } from '../../../context/application/application'
import { useApplicationContext } from '../../../context/application/ApplicationContext'
import useTranslation from '../../../hooks/useTranslation'
import { ApplicationReasonType, EducationType, ISituationChild, SituationType } from '../../../types/situation'
import ErrorSummaryWrapper from '../../common/ErrorSummaryWrapper'
import FormElement from '../../common/FormElement'
import FormGroup from '../../common/FormGroup'
import Navigation from '../../common/Navigation'
import { RHFCheckboksGruppe } from '../../common/rhf/RHFCheckboksPanelGruppe'
import { RHFGeneralQuestionRadio, RHFInlineRadio } from '../../common/rhf/RHFRadio'
import StepHeading from '../../common/StepHeading'
import { StepProps } from '../Dialogue'

export default function YourSituation({ next, prev, type }: StepProps) {
    const { state, dispatch } = useApplicationContext()
    const { t } = useTranslation('yourSituation')

    const save = (data: ISituationChild) => {
        dispatch({ type: ActionTypes.UPDATE_YOUR_SITUATION, payload: { ...data } })
        next!!()
    }

    const methods = useForm<any>({
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
                        name={`whatsYourSituation`}
                        legend={t('whatsYourSituation')}
                        checkboxes={[
                            {
                                label: t(SituationType.ORPHAN),
                                value: SituationType.ORPHAN,
                                required: true,
                            },
                            {
                                label: t(SituationType.OCCUPATIONAL_INJURY),
                                value: SituationType.OCCUPATIONAL_INJURY,
                                required: true,
                            },
                        ]}
                    />
                </FormElement>

                <FormElement>
                    <RHFCheckboksGruppe
                        name={`whyDoYouApply`}
                        legend={t('whyDoYouApply')}
                        checkboxes={[
                            {
                                label: t(ApplicationReasonType.EDUCATION),
                                value: ApplicationReasonType.EDUCATION,
                                required: true,
                            },
                            {
                                label: t(ApplicationReasonType.APPRENTICE),
                                value: ApplicationReasonType.APPRENTICE,
                                required: true,
                            },
                            {
                                label: t(ApplicationReasonType.INTERNSHIP),
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
                        <RHFGeneralQuestionRadio name={'doYouGetPaid'} legend={t('doYouGetPaid')} />
                    </FormElement>
                </FormGroup>
                <ErrorSummaryWrapper errors={errors} />

                <Navigation next={handleSubmit(save)} prev={prev} />
            </form>
        </FormProvider>
    )
}
