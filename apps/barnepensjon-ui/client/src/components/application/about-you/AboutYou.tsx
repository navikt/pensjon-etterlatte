import { Cell, Grid } from '@navikt/ds-react'
import { FormProvider, useForm } from 'react-hook-form'
import styled from 'styled-components'
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

const StaysAbroadWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`

export default function AboutYou({ next }: StepProps) {
    const { t } = useTranslation('aboutYou')
    const { state, dispatch } = useApplicationContext()
    const { state: user } = useUserContext()
    const { countries } = useCountries()

    const save = (data: any) => {
        dispatch({ type: ActionTypes.UPDATE_ABOUT_YOU, payload: { ...data } })
        next!!()
    }

    const methods = useForm<any>({
        defaultValues: state.aboutYou || {},
        shouldUnregister: true,
    })

    const {
        handleSubmit,
        watch,
        formState: { errors },
    } = methods

    const addressConfirmed = watch('addressOfResidenceApproved')
    const residesInNorway = watch('staysInNorway')
    const accountType = watch('accountType')

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
                                    name={'addressOfResidenceApproved'}
                                    legend={t('addressOfResidenceApproved')}
                                />

                                {addressConfirmed === JaNeiVetIkke.NEI && (
                                    <FormGroup>
                                        <RHFInput name={'alternativAddress'} label={t('alternativAddress')} />
                                    </FormGroup>
                                )}
                            </>
                        )}

                        {!!user.foedselsnummer && !user.telefonnummer && (
                            <FormGroup>
                                <Grid>
                                    <Cell xs={12} md={6} className={'kol'}>
                                        <RHFTelefonInput
                                            bredde={'S'}
                                            name={'contactInfo.phoneNumber'}
                                            label={t('contactInfo.phoneNumber')}
                                            valgfri={true}
                                        />
                                    </Cell>
                                </Grid>
                            </FormGroup>
                        )}
                    </FormGroup>

                    {/* 2.7 */}
                    {!user.adressebeskyttelse && (
                        <>
                            <FormGroup>
                                <RHFGeneralQuestionRadio
                                    name={'staysInNorway'}
                                    legend={t('staysInNorway')}
                                    description={<WhyWeAsk title="staysInNorway">{t('stayWhy')}</WhyWeAsk>}
                                />
                            </FormGroup>

                            {residesInNorway === JaNeiVetIkke.JA && (
                                <PaymentDetails accountType={BankkontoType.NORSK} hideSelectType={true} />
                            )}

                            {residesInNorway === JaNeiVetIkke.NEI && (
                                <StaysAbroadWrapper>
                                    <RHFSelect
                                        className="kol-50"
                                        name={`countryOfResidence`}
                                        label={t('countryOfResidence')}
                                        selectOptions={countries as any[]}
                                    />

                                    <RHFGeneralQuestionRadio
                                        name={'medlemFolketrygdenUtland'}
                                        legend={t('medlemFolketrygdenUtland')}
                                    />

                                    <PaymentDetails accountType={accountType} />
                                </StaysAbroadWrapper>
                            )}
                        </>
                    )}

                    <br />

                    <ErrorSummaryWrapper errors={errors} />

                    <Navigation next={handleSubmit(save)} />
                </form>
            </FormProvider>
        </>
    )
}
