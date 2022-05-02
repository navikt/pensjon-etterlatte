import { FormProvider, useForm } from 'react-hook-form'
import { ActionTypes, IDeceasedParent } from '../../../context/application/application'
import { useApplicationContext } from '../../../context/application/ApplicationContext'
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

    const save = (data: IDeceasedParent) => {
        dispatch({ type: type!!, payload: { ...data } })
        next!!()
    }

    const methods = useForm<any>({
        defaultValues:
            type === ActionTypes.UPDATE_FIRST_PARENT ? { ...state.firstParent } : { ...state.secondParent } || {},
        shouldUnregister: true,
    })

    const {
        handleSubmit,
        formState: { errors },
    } = methods

    return (
        <FormProvider {...methods}>
            <form>
                <DeceasedParentTitle type={type!!} situation={state?.applicant?.applicantSituation} />

                <DeceasedParentForm fnrRegisteredParent={fnrRegisteredParent || ['']} />

                <ErrorSummaryWrapper errors={errors} />

                <Navigation
                    right={{
                        label: t(fnrRegisteredParent ? 'saveButton' : 'nextButton', { ns: 'btn' }),
                        onClick: handleSubmit(save),
                    }}
                    left={{ label: t('backButton', { ns: 'btn' }), variant: 'secondary', onClick: prev }}
                    hideCancel={fnrRegisteredParent ? true : false}
                />
            </form>
        </FormProvider>
    )
}
