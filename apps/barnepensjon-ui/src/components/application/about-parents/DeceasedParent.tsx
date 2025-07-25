import { FormProvider, useForm } from 'react-hook-form'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import { isDev } from '~api/axios'
import { useApplicationContext } from '~context/application/ApplicationContext'
import { ActionTypes, IDeceasedParent } from '~context/application/application'
import { LogEvents, useAnalytics } from '~hooks/useAnalytics'
import useTranslation from '../../../hooks/useTranslation'
import ErrorSummaryWrapper from '../../common/ErrorSummaryWrapper'
import Navigation from '../../common/Navigation'
import { StepProps } from '../Dialogue'
import DeceasedParentForm from '../the-deceased/DeceasedParentForm'
import DeceasedParentTitle from '../the-deceased/DeceasedParentTitle'

interface Props extends StepProps {
    fnrRegisteredParent?: string[]
}

export default function DeceasedParent({ next, prev, type, fnrRegisteredParent }: Props) {
    const { state, dispatch } = useApplicationContext()
    const { t } = useTranslation()
    const { logEvent } = useAnalytics()

    const saveNext = (data: IDeceasedParent) => {
        dispatch({ type: type!, payload: { ...data, isValidated: true } })

        // Logger svar om avdød har bodd i utlandet for å sjekke opp mot hypotese
        logEvent(LogEvents.QUESTION_ANSWERED, {
            skjemanavn: 'DeceasedParent',
            spørsmål: 'didTheDeceasedLiveAbroad',
            svar: data.staysAbroad.hasStaysAbroad,
        })

        next!()
    }

    const savePrev = (data: IDeceasedParent) => {
        dispatch({ type: type!, payload: { ...data, isValidated: true } })
        prev!()
    }

    const savePrevWithoutValidation = () => {
        const values = getValues()
        dispatch({ type: type!, payload: { ...values, isValidated: false } })
        prev!()
    }

    const isFormValidated =
        type === ActionTypes.UPDATE_FIRST_PARENT
            ? (state.firstParent as IDeceasedParent)?.isValidated
            : (state.secondParent as IDeceasedParent)?.isValidated

    const logErrors = (data: FieldErrors<IDeceasedParent>) => {
        Object.keys(data).map((error) =>
            logEvent(LogEvents.VALIDATION_ERROR, { skjemanavn: 'DeceasedParent', id: error })
        )
    }

    const methods = useForm<IDeceasedParent>({
        defaultValues: type === ActionTypes.UPDATE_FIRST_PARENT ? { ...state.firstParent } : { ...state.secondParent },
        shouldUnregister: true,
    })

    const {
        handleSubmit,
        formState: { errors },
        getValues,
    } = methods

    return (
        <FormProvider {...methods}>
            <form autoComplete={isDev ? 'on' : 'off'}>
                <DeceasedParentTitle type={type!} situation={state?.applicant?.applicantSituation} />

                <DeceasedParentForm fnrRegisteredParent={fnrRegisteredParent || ['']} />

                <ErrorSummaryWrapper errors={errors} />

                <Navigation
                    right={{
                        label: t(fnrRegisteredParent ? 'saveButton' : 'nextButton', { ns: 'btn' }),
                        onClick: handleSubmit(saveNext, logErrors),
                    }}
                    left={{
                        label: t('backButton', { ns: 'btn' }),
                        variant: 'secondary',
                        onClick: !!isFormValidated ? handleSubmit(savePrev, logErrors) : savePrevWithoutValidation,
                    }}
                    hideCancel={!!fnrRegisteredParent}
                />
            </form>
        </FormProvider>
    )
}
