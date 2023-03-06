import { Cell, Grid } from '@navikt/ds-react'
import { FormProvider, useForm } from 'react-hook-form'
import { JaNeiVetIkke } from '../../../api/dto/FellesOpplysninger'
import { ActionTypes } from '../../../context/application/application'
import { useApplicationContext } from '../../../context/application/ApplicationContext'
import { useUserContext } from '../../../context/user/UserContext'
import useTranslation from '../../../hooks/useTranslation'
import ErrorSummaryWrapper from '../../common/ErrorSummaryWrapper'
import FormGroup from '../../common/FormGroup'
import Navigation from '../../common/Navigation'
import { RHFInput, RHFTelefonInput } from '../../common/rhf/RHFInput'
import { RHFGeneralQuestionRadio } from '../../common/rhf/RHFRadio'
import StepHeading from '../../common/StepHeading'
import { StepProps } from '../Dialogue'
import LoggedInUserInfo from './LoggedInUserInfo'
import FormElement from '../../common/FormElement'
import { IAboutYou } from '../../../types/person'
import PaymentDetails from '../../common/PaymentDetails'
import { ApplicantRole } from '../scenario/ScenarioSelection'

export default function AboutYou({ next }: StepProps) {
    const { t } = useTranslation('aboutYou')
    const { state, dispatch } = useApplicationContext()
    const { state: user } = useUserContext()

    const save = (data: any) => {
        dispatch({ type: ActionTypes.UPDATE_ABOUT_YOU, payload: { ...data } })
        next!!()
    }

    const methods = useForm<IAboutYou>({
        defaultValues: state.aboutYou || {},
        shouldUnregister: true,
    })

    const {
        handleSubmit,
        watch,
        formState: { errors },
    } = methods

    const addressConfirmed = watch('addressOfResidenceConfirmed')
    const isChild = state.applicant?.applicantRole === ApplicantRole.CHILD
    const isGuardian = state.applicant?.applicantRole === ApplicantRole.GUARDIAN

    return (
        <>
            <StepHeading>{t('title')}</StepHeading>

            <LoggedInUserInfo user={user} />

            <FormProvider {...methods}>
                <form>
                    <FormGroup>
                        {!user.adressebeskyttelse && isChild && (
                            <>
                                <RHFGeneralQuestionRadio
                                    name={'addressOfResidenceConfirmed'}
                                    legend={t('addressOfResidenceConfirmed')}
                                />

                                {addressConfirmed === JaNeiVetIkke.NEI && (
                                    <FormElement>
                                        <RHFInput name={'alternativeAddress'} label={t('alternativeAddress')} />
                                    </FormElement>
                                )}
                            </>
                        )}

                        {!!user.foedselsnummer && !user.telefonnummer && !isGuardian && (
                            <Grid>
                                <Cell xs={12} md={6}>
                                    <FormElement>
                                        <RHFTelefonInput
                                            name={'phoneNumber'}
                                            label={t('phoneNumberOptional', { ns: 'common' })}
                                            valgfri={true}
                                            htmlSize={20}
                                        />
                                    </FormElement>
                                </Cell>
                            </Grid>
                        )}
                    </FormGroup>

                    {/* TODO: Når vi støtter barn og dette blir tilgjengelig må vi justere mappingen av paymentDetails */}
                    {!user.adressebeskyttelse && isChild && <PaymentDetails />}

                    <ErrorSummaryWrapper errors={errors} />

                    <Navigation right={{ onClick: handleSubmit(save) }} />
                </form>
            </FormProvider>
        </>
    )
}
