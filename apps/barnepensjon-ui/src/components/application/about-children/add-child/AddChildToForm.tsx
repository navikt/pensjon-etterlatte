import { Alert, BodyLong, Box, Button, Heading, HStack, Label, Panel, ReadMore, VStack } from '@navikt/ds-react'
import { fnr as fnrValidator } from '@navikt/fnrvalidator'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import { isDev } from '~api/axios'
import { RHFGeneralQuestionRadio } from '~components/common/rhf/RHFRadio'
import { useUserContext } from '~context/user/UserContext'
import { LogEvents, useAnalytics } from '~hooks/useAnalytics'
import { IChild, ParentRelationType } from '~types/person'
import { getAgeFromDate, getAgeFromFoedselsnummer, isLegalAge } from '~utils/age'
import ikon from '../../../../assets/barn1.svg'
import useCountries, { Options } from '../../../../hooks/useCountries'
import useTranslation from '../../../../hooks/useTranslation'
import ErrorSummaryWrapper from '../../../common/ErrorSummaryWrapper'
import PaymentDetails from '../../../common/PaymentDetails'
import PersonInfo from '../../../common/PersonInfo'
import { RHFConfirmationPanel } from '../../../common/rhf/RHFCheckboksPanelGruppe'
import { GuardianDetails } from './GuardianDetails'
import { IsGuardianQuestion } from './IsGuardianQuestion'
import { LivesAbroadQuestion } from './LivesAbroadQuestion'
import ParentQuestion from './ParentQuestion'
import './addChildToForm.css'

interface Props {
    cancel: (removeActive?: boolean) => void
    save: (data: IChild) => void
    child: IChild
    fnrRegisteredChild: string[]
    isChild: boolean
    isGuardian: boolean
}

const checkFnr = (fnr?: string): boolean => {
    return (fnr && fnrValidator(fnr).status === 'valid') || false
}

const AddChildToForm = ({ cancel, save, child, fnrRegisteredChild, isChild, isGuardian }: Props) => {
    const { t } = useTranslation('aboutChildren')
    const { countries }: { countries: Options[] } = useCountries()
    const { state: user } = useUserContext()
    const { logEvent } = useAnalytics()

    const methods = useForm<IChild>({
        defaultValues: {
            ...child,
        },
        shouldUnregister: true,
    })

    const editsChild = !!child?.firstName?.length

    const {
        formState: { errors },
        handleSubmit,
        reset,
        watch,
    } = methods

    const addAndClose = (data: IChild) => {
        save(data)
        reset()
        window.scrollTo(0, 0)
    }

    const logErrors = (data: FieldErrors<IChild>) => {
        Object.keys(data).map((error) =>
            logEvent(LogEvents.VALIDATION_ERROR, { skjemanavn: 'AddChildToForm', id: error })
        )
    }

    const cancelAndClose = () => {
        if (child.fnrDnr === undefined && child.dateOfBirth === undefined) cancel(true)
        else cancel()
        window.scrollTo(0, 0)
    }

    const parents = watch('parents')
    const fnr = watch('fnrDnr')
    const dateOfBirth: string | undefined = watch('dateOfBirth')
    const appliesForChildrensPension: boolean | undefined = watch('appliesForChildrensPension')
    const childHasGuardianship = watch('childHasGuardianship.answer')
    const loggedInUserIsGuardian = watch('loggedInUserIsGuardian')
    const livesAbroadAnswer = watch('staysAbroad.answer')

    const canApplyForChildrensPension = (): boolean => {
        if (parents === ParentRelationType.BOTH) {
            if (isGuardian) return true
            return !childOver18()
        }

        return false
    }

    const childOver18 = () => {
        return (
            (checkFnr(fnr) && isLegalAge(getAgeFromFoedselsnummer(fnr!))) ||
            (dateOfBirth && isLegalAge(getAgeFromDate(dateOfBirth)))
        )
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <FormProvider {...methods}>
            <form autoComplete={isDev ? 'on' : 'off'}>
                <Box borderRadius="4" borderWidth="1" marginBlock="4">
                    <Box
                        borderRadius="4 4 0 0"
                        height="128px"
                        borderWidth="0 0 4 0"
                        style={{
                            backgroundColor: '#4d3e55',
                            borderBottomColor: '#826ba1',
                        }}
                    >
                        <HStack className="change-child-card-header-hstack" align="end" height="100%">
                            <img alt="barn" src={ikon} />
                            <Heading size={'small'} className={'heading'}>
                                {!isChild ? t('titleModal') : t('aboutTheSiblingTitle')}
                            </Heading>
                        </HStack>
                    </Box>

                    <Box padding="8">
                        <VStack gap="4">
                            <Box>
                                <PersonInfo duplicateList={fnrRegisteredChild} fnrIsUnknown={watch('fnrIsUnknown')} />
                                {childOver18() && !isGuardian && (
                                    <Box padding="4" borderWidth="1" borderRadius="small">
                                        <Alert id={'above18Warning'} inline={true} variant={'info'}>
                                            <BodyLong>{t('onlyChildrenUnder18Necessary')}</BodyLong>
                                        </Alert>
                                    </Box>
                                )}
                            </Box>

                            <ParentQuestion parents={parents} />

                            {canApplyForChildrensPension() && (
                                <>
                                    {isChild && !user.adressebeskyttelse && (
                                        <LivesAbroadQuestion
                                            isChild={isChild}
                                            countries={countries}
                                            livesAbroadAnswer={livesAbroadAnswer}
                                        />
                                    )}
                                    {!isChild && (
                                        <>
                                            <VStack gap="8">
                                                {!user.adressebeskyttelse && (
                                                    <LivesAbroadQuestion
                                                        isChild={isChild}
                                                        countries={countries}
                                                        livesAbroadAnswer={livesAbroadAnswer}
                                                    />
                                                )}

                                                <IsGuardianQuestion
                                                    isGuardian={isGuardian}
                                                    loggedInUserIsGuardian={loggedInUserIsGuardian}
                                                />

                                                {isGuardian && childOver18() && (
                                                    <VStack gap="4">
                                                        <RHFGeneralQuestionRadio
                                                            name={'disabilityBenefitsIsGuardian'}
                                                            legend={t('disabilityBenefitsIsGuardian')}
                                                        />
                                                        <ReadMore header={t('whyWeAsk', { ns: 'common' })}>
                                                            {t('disabilityBenefitsInfo')}
                                                        </ReadMore>
                                                        <RHFGeneralQuestionRadio
                                                            name={'workAssessmentAllowanceIsGuardian'}
                                                            legend={t('workAssessmentAllowanceIsGuardian')}
                                                        />
                                                        <ReadMore header={t('whyWeAsk', { ns: 'common' })}>
                                                            {t('workAssessmentAllowanceInfo')}
                                                        </ReadMore>
                                                    </VStack>
                                                )}
                                            </VStack>

                                            <GuardianDetails
                                                isGuardian={isGuardian}
                                                childHasGuardianship={childHasGuardianship}
                                            />

                                            <VStack>
                                                <Label>{t('applyForThisChild')}</Label>
                                                <RHFConfirmationPanel
                                                    name={'appliesForChildrensPension'}
                                                    label={t('userAppliesForChildrensPension')}
                                                    valgfri={true}
                                                    size={'medium'}
                                                />
                                            </VStack>

                                            {!user.adressebeskyttelse && appliesForChildrensPension && (
                                                <PaymentDetails />
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </VStack>

                        <ErrorSummaryWrapper errors={errors} />
                        <VStack marginBlock="4 0" align="center">
                            <HStack gap="4">
                                <Button
                                    id={'cancelAddChildren'}
                                    variant={'secondary'}
                                    type={'button'}
                                    onClick={cancelAndClose}
                                >
                                    {t('cancelButton', { ns: 'btn' })}
                                </Button>

                                <Button
                                    id={'addChildren'}
                                    variant={'primary'}
                                    type={'button'}
                                    onClick={handleSubmit(addAndClose, logErrors)}
                                >
                                    {editsChild ? t('saveChangesButton', { ns: 'btn' }) : t('addButton', { ns: 'btn' })}
                                </Button>
                            </HStack>
                        </VStack>
                    </Box>
                </Box>
            </form>
        </FormProvider>
    )
}

export default AddChildToForm
