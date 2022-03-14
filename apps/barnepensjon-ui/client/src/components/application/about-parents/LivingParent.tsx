import { StepProps } from '../Dialogue'
import StepHeading from '../../common/StepHeading'
import Navigation from '../../common/Navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { ILivingParent } from '../../../context/application/application'
import { useApplicationContext } from '../../../context/application/ApplicationContext'
import useTranslation from '../../../hooks/useTranslation'
import PersonInfo from '../../common/PersonInfo'
import { RHFInput, RHFTelefonInput } from '../../common/rhf/RHFInput'
import ErrorSummaryWrapper from '../../common/ErrorSummaryWrapper'
import FormElement from '../../common/FormElement'
import FormGroup from '../../common/FormGroup'

export default function LivingParent({ next, prev, type }: StepProps) {
    const { state, dispatch } = useApplicationContext()
    const { t } = useTranslation('livingParent')

    const save = (data: ILivingParent) => {
        dispatch({ type: type!!, payload: { ...data } })
        next!!()
    }

    const methods = useForm<any>({
        defaultValues: { ...state.firstParent } || {},
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

                <FormGroup>
                    <PersonInfo />
                </FormGroup>
                <FormElement>
                    <RHFInput name={'address'} label={t('address')} />
                </FormElement>
                <FormElement>
                    <RHFTelefonInput name={'phoneNumber'} label={t('phoneNumber')} valgfri={true} />
                </FormElement>
                <ErrorSummaryWrapper errors={errors} />

                <Navigation
                    right={{ label: t('saveButton', { ns: 'navigation' }), onClick: handleSubmit(save) }}
                    left={{ label: t('backButton', { ns: 'navigation' }), variant: 'secondary', onClick: prev }}
                    hideCancel={true}
                />
            </form>
        </FormProvider>
    )
}
