import { Heading, VStack } from '@navikt/ds-react'
import { FormProvider, useForm } from 'react-hook-form'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import { useApplicationContext } from '~context/application/ApplicationContext'
import { IDeceasedParent, ILivingParent, IParent } from '~context/application/application'
import { LogEvents, useAnalytics } from '~hooks/useAnalytics'
import useTranslation from '../../../hooks/useTranslation'
import ErrorSummaryWrapper from '../../common/ErrorSummaryWrapper'
import Navigation from '../../common/Navigation'
import PersonInfo from '../../common/PersonInfo'
import { RHFInput, RHFTelefonInput } from '../../common/rhf/RHFInput'
import { StepProps } from '../Dialogue'

interface Props extends StepProps {
    fnrRegisteredParent?: string[]
}

export default function LivingParent({ next, prev, type, fnrRegisteredParent }: Props) {
    const { state, dispatch } = useApplicationContext()
    const { t } = useTranslation('livingParent')
    const { logEvent } = useAnalytics()

    const save = (data: ILivingParent) => {
        dispatch({ type: type!, payload: { ...data } })
        next!()
    }

    const logErrors = (data: FieldErrors<ILivingParent>) => {
        Object.keys(data).map((error) =>
            logEvent(LogEvents.VALIDATION_ERROR, { skjemanavn: 'LivingParent', id: error })
        )
    }

    const methods = useForm<IParent | IDeceasedParent>({
        defaultValues: { ...state.firstParent },
        shouldUnregister: true,
    })

    const {
        handleSubmit,
        formState: { errors },
        watch,
    } = methods

    return (
        <FormProvider {...methods}>
            <form>
                <VStack align="center" marginBlock="12 8">
                    <Heading size={'medium'}>{t('title')}</Heading>
                </VStack>

                <VStack marginBlock="0 4" gap="4">
                    <PersonInfo duplicateList={fnrRegisteredParent} fnrIsUnknown={watch('fnrIsUnknown')} />
                    <RHFInput name={'address'} label={t('address')} valgfri={true} />
                    <RHFTelefonInput
                        name={'phoneNumber'}
                        label={t('phoneNumberOptional', { ns: 'common' })}
                        valgfri={true}
                    />
                </VStack>
                <ErrorSummaryWrapper errors={errors} />

                <Navigation
                    right={{ label: t('saveButton', { ns: 'btn' }), onClick: handleSubmit(save, logErrors) }}
                    left={{ label: t('backButton', { ns: 'btn' }), variant: 'secondary', onClick: prev }}
                    hideCancel={true}
                />
            </form>
        </FormProvider>
    )
}
