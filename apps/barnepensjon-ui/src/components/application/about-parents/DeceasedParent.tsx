import { FormProvider, useForm } from 'react-hook-form'
import { ActionTypes, IDeceasedParent } from '../../../context/application/application'
import { useApplicationContext } from '../../../context/application/ApplicationContext'
import useTranslation from '../../../hooks/useTranslation'
import ErrorSummaryWrapper from '../../common/ErrorSummaryWrapper'
import Navigation from '../../common/Navigation'
import { StepProps } from '../Dialogue'
import DeceasedParentForm from '../the-deceased/DeceasedParentForm'
import DeceasedParentTitle from '../the-deceased/DeceasedParentTitle'
import { isDev } from '../../../api/axios'
import { useState } from 'react'
import { PrevStepModal } from '~components/common/PrevStepModal'

interface Props extends StepProps {
    fnrRegisteredParent?: string[]
}

export default function DeceasedParent({ next, prev, type, fnrRegisteredParent }: Props) {
    const { state, dispatch } = useApplicationContext()
    const { t } = useTranslation()
    const [open, setOpen] = useState(false)

    const saveNext = (data: IDeceasedParent) => {
        dispatch({ type: type!, payload: { ...data } })
        next!()
    }

    const savePrev = (data: IDeceasedParent) => {
        dispatch({ type: type!, payload: { ...data } })
        prev!()
    }

    const methods = useForm<any>({
        defaultValues: type === ActionTypes.UPDATE_FIRST_PARENT ? { ...state.firstParent } : { ...state.secondParent },
        shouldUnregister: true,
    })

    const {
        handleSubmit,
        formState: { errors, isDirty, isValid },
    } = methods

    const handlePrev = () => {
        if (!isDirty) prev!() // Hvis bruker ikke har gjort noe, gå tilbake uten validering
        if (isValid) handleSubmit(savePrev)() // Hvis form er valid, valider og gå tilbake

        // Hvis form ikke er valid og bruker har gjort noe, vis modal som lar bruker velge om de vil gå tilbake uten å lagre endringer
        if (isDirty && !isValid) {
            setOpen(true)
        }
    }

    return (
        <FormProvider {...methods}>
            <form autoComplete={isDev ? 'on' : 'off'}>
                <DeceasedParentTitle type={type!} situation={state?.applicant?.applicantSituation} />

                <DeceasedParentForm fnrRegisteredParent={fnrRegisteredParent || ['']} />

                <ErrorSummaryWrapper errors={errors} />

                <PrevStepModal prev={prev} open={open} setOpen={setOpen} />

                <Navigation
                    right={{
                        label: t(fnrRegisteredParent ? 'saveButton' : 'nextButton', { ns: 'btn' }),
                        onClick: handleSubmit(saveNext),
                    }}
                    left={{
                        label: t('backButton', { ns: 'btn' }),
                        variant: 'secondary',
                        onClick: handlePrev,
                    }}
                    hideCancel={!!fnrRegisteredParent}
                />
            </form>
        </FormProvider>
    )
}
