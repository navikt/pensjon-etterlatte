import { FormProvider, useForm } from 'react-hook-form'
import { JaNeiVetIkke } from '../../../api/dto/FellesOpplysninger'
import { ActionTypes } from '../../../context/application/application'
import { useApplicationContext } from '../../../context/application/ApplicationContext'
import { useUserContext } from '../../../context/user/UserContext'
import useTranslation from '../../../hooks/useTranslation'
import ErrorSummaryWrapper from '../../common/ErrorSummaryWrapper'
import Navigation from '../../common/Navigation'
import { RHFTelefonInput } from '../../common/rhf/RHFInput'
import { RHFGeneralQuestionRadio } from '../../common/rhf/RHFRadio'
import StepHeading from '../../common/StepHeading'
import { StepProps } from '../Dialogue'
import LoggedInUserInfo from './LoggedInUserInfo'
import FormElement from '../../common/FormElement'
import { IAboutYou } from '../../../types/person'
import PaymentDetails from '../../common/PaymentDetails'
import { ApplicantRole } from '../scenario/ScenarioSelection'
import { StandardBreddeRHFSelect } from '../../common/rhf/RHFSelect'
import useCountries from '../../../hooks/useCountries'
import { Bredde } from '../../../utils/bredde'
import Datepicker from '../../common/Datepicker'
import { Heading, HGrid } from '@navikt/ds-react'
import { GridColumns, GridGap } from '../../../utils/grid'
import FormGroup from '../../common/FormGroup'

export default function AboutYou({ next }: StepProps) {
    const { t } = useTranslation('aboutYou')
    const { state, dispatch } = useApplicationContext()
    const { state: user } = useUserContext()
    const { countries }: { countries: any } = useCountries()

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

    const residesInNorway = watch('residesInNorway')
    const stayedAbroad = watch('stayedAbroad')
    const isChild = state.applicant?.applicantRole === ApplicantRole.CHILD
    const isGuardian = state.applicant?.applicantRole === ApplicantRole.GUARDIAN

    return (
        <>
            <StepHeading>{t('title')}</StepHeading>

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
                                        <FormElement>
                                            <StandardBreddeRHFSelect
                                                id={'stayedAbroadCountry'}
                                                name={'stayedAbroadCountry'}
                                                label={t('stayedAbroadCountry')}
                                                children={countries}
                                            />
                                        </FormElement>
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
                                    <FormElement>
                                        <StandardBreddeRHFSelect
                                            id={'countryOfResidence'}
                                            name={'countryOfResidence'}
                                            label={t('countryOfResidence')}
                                            children={countries}
                                        />
                                    </FormElement>
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
                                />
                            </FormElement>
                        )}
                    </FormElement>

                    {!user.adressebeskyttelse && isChild && <PaymentDetails />}

                    <ErrorSummaryWrapper errors={errors} />

                    <Navigation right={{ onClick: handleSubmit(save) }} />
                </form>
            </FormProvider>
        </>
    )
}
