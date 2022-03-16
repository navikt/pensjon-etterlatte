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

    return (
        <>
            {/* Steg 2 */}
            <StepHeading>{t('title')}</StepHeading>

            {/* Informasjon om den innloggede brukeren */}
            <LoggedInUserInfo user={user} />

            {/* Skjema for utfylling av info om innlogget bruker / søker */}
            <FormProvider {...methods}>
                <form>
                    <FormGroup>
                        {!user.adressebeskyttelse && (
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

                        {!!user.foedselsnummer && !user.telefonnummer && (
                            <Grid>
                                <Cell xs={12} md={6}>
                                    <FormElement>
                                        <RHFTelefonInput
                                            bredde={'S'}
                                            name={'phoneNumber'}
                                            label={t('phoneNumber', { ns: 'common' })}
                                            valgfri={true}
                                        />
                                    </FormElement>
                                </Cell>
                            </Grid>
                        )}
                    </FormGroup>

                    {/* 2.7 */}
                    {!user.adressebeskyttelse && isChild && <PaymentDetails watch={watch} />}

                    <ErrorSummaryWrapper errors={errors} />

                    <Navigation right={{ onClick: handleSubmit(save) }} />
                </form>
            </FormProvider>
        </>
    )
}
