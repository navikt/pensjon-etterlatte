import { FormProvider, useForm } from 'react-hook-form'
import { JaNeiVetIkke } from '~api/dto/FellesOpplysninger'
import { ActionTypes } from '~context/application/application'
import { useApplicationContext } from '~context/application/ApplicationContext'
import { useUserContext } from '~context/user/UserContext'
import useTranslation from '../../../hooks/useTranslation'
import ErrorSummaryWrapper from '../../common/ErrorSummaryWrapper'
import Navigation from '../../common/Navigation'
import { RHFTelefonInput } from '../../common/rhf/RHFInput'
import { RHFGeneralQuestionRadio } from '../../common/rhf/RHFRadio'
import StepHeading from '../../common/StepHeading'
import { StepProps } from '../Dialogue'
import LoggedInUserInfo from './LoggedInUserInfo'
import FormElement from '../../common/FormElement'
import { IAboutYou } from '~types/person'
import PaymentDetails from '../../common/PaymentDetails'
import useCountries, { Options } from '../../../hooks/useCountries'
import { Bredde } from '~utils/bredde'
import Datepicker from '../../common/Datepicker'
import { Box, Heading, HGrid, ReadMore } from '@navikt/ds-react'
import { GridColumns, GridGap } from '~utils/grid'
import FormGroup from '../../common/FormGroup'
import { ApplicantRole } from '~types/applicant'
import { RHFCombobox } from '~components/common/rhf/RHFCombobox'
import { LogEvents, useAmplitude } from '~hooks/useAmplitude'
import { FieldErrors } from 'react-hook-form/dist/types/errors'

export default function AboutYou({ next }: StepProps) {
    const { t } = useTranslation('aboutYou')
    const { state, dispatch } = useApplicationContext()
    const { state: user } = useUserContext()
    const { countries }: { countries: Options[] } = useCountries()
    const { logEvent } = useAmplitude()

    const save = (data: IAboutYou) => {
        dispatch({ type: ActionTypes.UPDATE_ABOUT_YOU, payload: { ...data } })
        next!()
    }

    const logErrors = (data: FieldErrors) => {
        Object.keys(data).map((error) => logEvent(LogEvents.VALIDATION_ERROR, { skjemanavn: 'AboutYou', id: error }))
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

    const residesInNorway = watch('residesInNorway')
    const stayedAbroad = watch('stayedAbroad')
    const isChild = state.applicant?.applicantRole === ApplicantRole.CHILD
    const isGuardian = state.applicant?.applicantRole === ApplicantRole.GUARDIAN

    return (
        <>
            <StepHeading>{isGuardian ? t('titleGuardian') : t('title')}</StepHeading>

            <LoggedInUserInfo user={user} />

            <FormProvider {...methods}>
                <form>
                    <FormElement>
                        {!user.adressebeskyttelse && isChild && (
                            <FormGroup>
                                <FormElement>
                                    <Heading size={'small'}>{t('staysAbroadTitle')}</Heading>
                                </FormElement>

                                <RHFGeneralQuestionRadio name={'residesInNorway'} legend={t('residesInNorway')} />

                                {residesInNorway === JaNeiVetIkke.JA && (
                                    <FormElement>
                                        <RHFGeneralQuestionRadio name={'stayedAbroad'} legend={t('stayedAbroad')} />
                                    </FormElement>
                                )}

                                {stayedAbroad === JaNeiVetIkke.JA && (
                                    <>
                                        <Box maxWidth="14rem">
                                            <FormElement>
                                                <RHFCombobox
                                                    id={'stayedAbroadCountry'}
                                                    name={'stayedAbroadCountry'}
                                                    label={t('stayedAbroadCountry')}
                                                    options={countries.map((country) => country.label)}
                                                />
                                            </FormElement>
                                        </Box>
                                        <HGrid gap={GridGap} columns={GridColumns} align={'start'}>
                                            <Datepicker
                                                name={'stayedAbroadFromDate'}
                                                label={t('stayedAbroadFromDate')}
                                                maxDate={new Date()}
                                                valgfri={true}
                                            />
                                            <Datepicker
                                                name={'stayedAbroadToDate'}
                                                label={t('stayedAbroadToDate')}
                                                maxDate={new Date()}
                                                valgfri={true}
                                            />
                                        </HGrid>
                                    </>
                                )}

                                {residesInNorway === JaNeiVetIkke.NEI && (
                                    <Box maxWidth="14rem">
                                        <FormElement>
                                            <RHFCombobox
                                                id={'countryOfResidence'}
                                                name={'countryOfResidence'}
                                                label={t('countryOfResidence')}
                                                options={countries.map((country) => country.label)}
                                            />
                                        </FormElement>
                                    </Box>
                                )}
                            </FormGroup>
                        )}

                        {!!user.foedselsnummer && !user.telefonnummer && !isGuardian && (
                            <FormElement>
                                <RHFTelefonInput
                                    name={'phoneNumber'}
                                    label={t('phoneNumberOptional', { ns: 'common' })}
                                    valgfri={true}
                                    htmlSize={Bredde.S}
                                    autoComplete="tel"
                                />
                            </FormElement>
                        )}
                    </FormElement>

                    {!user.adressebeskyttelse && isChild && (
                        <>
                            <Heading size={'small'}>{t('paymentsFromNav')}</Heading>
                            <FormGroup>
                                <FormElement>
                                    <RHFGeneralQuestionRadio
                                        name={'disabilityBenefits'}
                                        legend={t('disabilityBenefits')}
                                    />
                                    <ReadMore header={t('whyWeAsk', { ns: 'common' })}>
                                        {t('disabilityBenefitsInfo')}
                                    </ReadMore>
                                </FormElement>

                                <FormElement>
                                    <RHFGeneralQuestionRadio
                                        name={'workAssessmentAllowance'}
                                        legend={t('workAssessmentAllowance')}
                                    />
                                    <ReadMore header={t('whyWeAsk', { ns: 'common' })}>
                                        {t('workAssessmentAllowanceInfo')}
                                    </ReadMore>
                                </FormElement>
                            </FormGroup>
                        </>
                    )}

                    {!user.adressebeskyttelse && isChild && (
                        <>
                            <Heading size={'small'}>{t('bankAccountNumberAndPayment')}</Heading>
                            <PaymentDetails />
                        </>
                    )}

                    <ErrorSummaryWrapper errors={errors} />

                    <Navigation right={{ onClick: handleSubmit(save, logErrors) }} />
                </form>
            </FormProvider>
        </>
    )
}
