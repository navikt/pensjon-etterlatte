import { useUserContext } from '../../../context/user/UserContext'
import { Cell, Grid } from '@navikt/ds-react'
import useTranslation from '../../../hooks/useTranslation'
import { useApplicationContext } from '../../../context/application/ApplicationContext'
import { ActionTypes } from '../../../context/application/application'
import { FormProvider, useForm } from 'react-hook-form'
import FormGroup from '../../common/FormGroup'
import WhyWeAsk from '../../common/WhyWeAsk'
import ErrorSummaryWrapper from '../../common/ErrorSummaryWrapper'
import Navigation from '../../common/Navigation'
import { RHFGeneralQuestionRadio } from '../../common/rhf/RHFRadio'
import { BankkontoType, JaNeiVetIkke } from '../../../api/dto/FellesOpplysninger'
import { RHFSelect } from '../../common/rhf/RHFSelect'
import { RHFInput, RHFTelefonInput } from '../../common/rhf/RHFInput'
import LoggedInUserInfo from './LoggedInUserInfo'
import PaymentDetails from './PaymentDetails'
import useCountries from '../../../hooks/useCountries'
import { StepProps } from '../Dialogue'
import StepHeading from '../../common/StepHeading'

export default function AboutYou({ next }: StepProps) {
    const { t } = useTranslation('omDeg')
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

    const addressConfirmed = watch('bostedsadresseBekreftet')
    const residesInNorway = watch('oppholderSegINorge')
    const accountType = watch('utbetalingsInformasjon.bankkontoType')

    return (
        <>
            {/* Steg 2 */}
            <StepHeading>{t('tittel')}</StepHeading>

            {/* Informasjon om den innloggede brukeren */}
            <LoggedInUserInfo user={user} />

            {/* Skjema for utfylling av info om innlogget bruker / søker */}
            <FormProvider {...methods}>
                <form>
                    <FormGroup>
                        {!user.adressebeskyttelse && (
                            <>
                                <RHFGeneralQuestionRadio
                                    name={'bostedsadresseBekreftet'}
                                    legend={t('bostedsadresseBekreftet')}
                                />

                                {addressConfirmed === JaNeiVetIkke.NEI && (
                                    <FormGroup>
                                        <RHFInput name={'alternativAdresse'} label={t('alternativAdresse')} />
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
                                            name={'kontaktinfo.telefonnummer'}
                                            label={t('kontaktinfo.telefonnummer')}
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
                            <RHFGeneralQuestionRadio
                                name={'oppholderSegINorge'}
                                legend={t('oppholderSegINorge')}
                                description={<WhyWeAsk title="oppholderSegINorge">{t('oppholdHvorfor')}</WhyWeAsk>}
                            />

                            {residesInNorway === JaNeiVetIkke.JA && (
                                <PaymentDetails accountType={BankkontoType.NORSK} hideSelectType={true} />
                            )}

                            {residesInNorway === JaNeiVetIkke.NEI && (
                                <>
                                    <FormGroup>
                                        <RHFSelect
                                            className="kol-50"
                                            name={`oppholdsland`}
                                            label={t('oppholdsland')}
                                            selectOptions={countries as any[]}
                                        />
                                    </FormGroup>

                                    <RHFGeneralQuestionRadio
                                        name={'medlemFolketrygdenUtland'}
                                        legend={t('medlemFolketrygdenUtland')}
                                    />

                                    <PaymentDetails accountType={accountType} />
                                </>
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
