import { useApplicationContext } from '../../../context/application/ApplicationContext'
import { FormProvider, useForm } from 'react-hook-form'
import ErrorSummaryWrapper from '../../common/ErrorSummaryWrapper'
import Navigation from '../../common/Navigation'
import { ActionTypes, IParent } from '../../../context/application/application'
import { StepProps } from '../Dialogue'
import DeceasedParentTitle from './DeceasedParentTitle'
import DeceaseParentForm from './DeceasedParentForm'

export default function AboutTheDeceased({ next, prev, type }: StepProps) {
    const { state, dispatch } = useApplicationContext()

    const save = (data: IParent) => {
        dispatch({ type: type!!, payload: { ...data } })
        next!!()
    }

    const methods = useForm<any>({
        defaultValues:
            (type === ActionTypes.UPDATE_FIRST_PARENT ? { ...state.firstParent } : { ...state.secondParent }) || {},
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

                <DeceaseParentForm />

                <ErrorSummaryWrapper errors={errors} />

                <Navigation right={{ onClick: handleSubmit(save) }} left={{ onClick: prev }} />
            </form>
        </FormProvider>
    )
}
