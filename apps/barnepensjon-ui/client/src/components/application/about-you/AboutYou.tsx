import { Cell, Grid } from '@navikt/ds-react'
import { FormProvider, useForm } from 'react-hook-form'
import { BankkontoType, JaNeiVetIkke } from '../../../api/dto/FellesOpplysninger'
import { ActionTypes } from '../../../context/application/application'
import { useApplicationContext } from '../../../context/application/ApplicationContext'
import { useUserContext } from '../../../context/user/UserContext'
import useCountries from '../../../hooks/useCountries'
import useTranslation from '../../../hooks/useTranslation'
import ErrorSummaryWrapper from '../../common/ErrorSummaryWrapper'
import FormGroup from '../../common/FormGroup'
import Navigation from '../../common/Navigation'
import { RHFInput, RHFTelefonInput } from '../../common/rhf/RHFInput'
import { RHFGeneralQuestionRadio } from '../../common/rhf/RHFRadio'
import { RHFSelect } from '../../common/rhf/RHFSelect'
import StepHeading from '../../common/StepHeading'
import WhyWeAsk from '../../common/WhyWeAsk'
import { StepProps } from '../Dialogue'
import LoggedInUserInfo from './LoggedInUserInfo'
import PaymentDetails from './PaymentDetails'
import FormElement from '../../common/FormElement'
import { IAboutYou } from '../../../types/person'

export default function AboutYou({ next }: StepProps) {
    const { t } = useTranslation('aboutYou')
    const { state, dispatch } = useApplicationContext()
    const { state: user } = useUserContext()
    const { countries } = useCountries()

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
    const residingInNorway = watch('residingInNorway')
    const accountType = watch('paymentDetails.accountType')

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
                                <Cell xs={12} md={6} className={'kol'}>
                                    <FormElement>
                                        <RHFTelefonInput
                                            bredde={'S'}
                                            name={'contactInfo.phoneNumber'}
                                            label={t('contactInfo.phoneNumber')}
                                            valgfri={true}
                                        />
                                    </FormElement>
                                </Cell>
                            </Grid>
                        )}
                    </FormGroup>

                    {/* 2.7 */}
                    {!user.adressebeskyttelse && (
                        <FormGroup>
                            <RHFGeneralQuestionRadio
                                name={'residesInNorway'}
                                legend={t('residesInNorway')}
                                description={<WhyWeAsk title="residesInNorway">{t('stayWhy')}</WhyWeAsk>}
                            />

                            {residingInNorway === JaNeiVetIkke.JA && (
                                <PaymentDetails accountType={BankkontoType.NORSK} hideSelectType={true} />
                            )}

                            {residingInNorway === JaNeiVetIkke.NEI && (
                                <>
                                    <FormElement>
                                        <RHFSelect
                                            className="kol-50"
                                            name={`countryOfResidence`}
                                            label={t('countryOfResidence')}
                                            selectOptions={countries as any[]}
                                        />
                                    </FormElement>

                                    <RHFGeneralQuestionRadio
                                        name={'memberFolketrygdenAbroad'}
                                        legend={t('memberFolketrygdenAbroad')}
                                    />

                                    <PaymentDetails accountType={accountType} />
                                </>
                            )}
                        </FormGroup>
                    )}

                    <br />

                    <ErrorSummaryWrapper errors={errors} />

                    <Navigation next={handleSubmit(save)} />
                </form>
            </FormProvider>
        </>
    )
}
