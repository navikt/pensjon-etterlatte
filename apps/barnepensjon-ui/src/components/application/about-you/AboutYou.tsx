import { Box, Heading, HGrid, ReadMore, VStack } from '@navikt/ds-react'
import { FormProvider, useForm } from 'react-hook-form'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import { JaNeiVetIkke } from '~api/dto/FellesOpplysninger'
import { RHFCombobox } from '~components/common/rhf/RHFCombobox'
import { useApplicationContext } from '~context/application/ApplicationContext'
import { ActionTypes } from '~context/application/application'
import { useUserContext } from '~context/user/UserContext'
import { LogEvents, useAnalytics } from '~hooks/useAnalytics'
import { ApplicantRole } from '~types/applicant'
import { IAboutYou } from '~types/person'
import { Bredde } from '~utils/bredde'
import { GridColumns, GridGap } from '~utils/grid'
import useCountries, { Options } from '../../../hooks/useCountries'
import useTranslation from '../../../hooks/useTranslation'
import Datepicker from '../../common/Datepicker'
import ErrorSummaryWrapper from '../../common/ErrorSummaryWrapper'
import Navigation from '../../common/Navigation'
import PaymentDetails from '../../common/PaymentDetails'
import { RHFTelefonInput } from '../../common/rhf/RHFInput'
import { RHFGeneralQuestionRadio } from '../../common/rhf/RHFRadio'
import { StepProps } from '../Dialogue'
import LoggedInUserInfo from './LoggedInUserInfo'

export default function AboutYou({ next }: StepProps) {
    const { t } = useTranslation('aboutYou')
    const { state, dispatch } = useApplicationContext()
    const { state: user } = useUserContext()
    const { countries }: { countries: Options[] } = useCountries()
    const { logEvent } = useAnalytics()

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
            <VStack align="center" marginBlock="12 0">
                <Heading size="medium">{isGuardian ? t('titleGuardian') : t('title')}</Heading>
            </VStack>

            <LoggedInUserInfo user={user} />

            <FormProvider {...methods}>
                <form>
                    <VStack marginBlock="8 0" gap="4">
                        {!user.adressebeskyttelse && isChild && (
                            <Box marginBlock="0 8">
                                <VStack gap="4">
                                    <Heading size={'small'}>{t('staysAbroadTitle')}</Heading>
                                    <RHFGeneralQuestionRadio name={'residesInNorway'} legend={t('residesInNorway')} />
                                    {residesInNorway === JaNeiVetIkke.JA && (
                                        <RHFGeneralQuestionRadio name={'stayedAbroad'} legend={t('stayedAbroad')} />
                                    )}
                                    {stayedAbroad === JaNeiVetIkke.JA && (
                                        <>
                                            <Box maxWidth="14rem">
                                                <RHFCombobox
                                                    id={'stayedAbroadCountry'}
                                                    name={'stayedAbroadCountry'}
                                                    label={t('stayedAbroadCountry')}
                                                    options={countries.map((country) => country.label)}
                                                />
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
                                            <RHFCombobox
                                                id={'countryOfResidence'}
                                                name={'countryOfResidence'}
                                                label={t('countryOfResidence')}
                                                options={countries.map((country) => country.label)}
                                            />
                                        </Box>
                                    )}
                                </VStack>
                            </Box>
                        )}

                        {!!user.foedselsnummer && !user.telefonnummer && !isGuardian && (
                            <RHFTelefonInput
                                name={'phoneNumber'}
                                label={t('phoneNumberOptional', { ns: 'common' })}
                                valgfri={true}
                                htmlSize={Bredde.S}
                                autoComplete="tel"
                            />
                        )}
                    </VStack>

                    {!user.adressebeskyttelse && isChild && (
                        <>
                            <Heading size={'small'}>{t('paymentsFromNav')}</Heading>
                            <VStack gap="4" marginBlock="0 8">
                                <VStack>
                                    <RHFGeneralQuestionRadio
                                        name={'disabilityBenefits'}
                                        legend={t('disabilityBenefits')}
                                    />
                                    <ReadMore header={t('whyWeAsk', { ns: 'common' })}>
                                        {t('disabilityBenefitsInfo')}
                                    </ReadMore>
                                </VStack>

                                <VStack>
                                    <RHFGeneralQuestionRadio
                                        name={'workAssessmentAllowance'}
                                        legend={t('workAssessmentAllowance')}
                                    />
                                    <ReadMore header={t('whyWeAsk', { ns: 'common' })}>
                                        {t('workAssessmentAllowanceInfo')}
                                    </ReadMore>
                                </VStack>
                            </VStack>
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
