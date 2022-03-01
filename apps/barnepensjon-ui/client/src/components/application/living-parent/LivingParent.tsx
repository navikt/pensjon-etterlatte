import { StepProps } from '../Dialogue'
import StepHeading from '../../common/StepHeading'
import Navigation from '../../common/Navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { ILivingParent } from '../../../context/application/application'
import { useApplicationContext } from '../../../context/application/ApplicationContext'
import useTranslation from '../../../hooks/useTranslation'
import PersonInfo from '../../common/PersonInfo'
import { RHFInput } from '../../common/rhf/RHFInput'
import FormGroup from '../../common/FormGroup'
import { Label } from '@navikt/ds-react'

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

    const { handleSubmit } = methods

    return (
        <FormProvider {...methods}>
            <form>
                <StepHeading>{t('title')}</StepHeading>

                <Label>{t('who')}</Label>
                <br />
                <PersonInfo />

                <FormGroup>
                    <RHFInput name={'address'} label={t('address')} />
                </FormGroup>

                <FormGroup>
                    <RHFInput name={'phoneNumber'} label={t('phoneNumber')} />
                </FormGroup>

                <Navigation next={handleSubmit(save)} prev={prev} />
            </form>
        </FormProvider>
    )
}
