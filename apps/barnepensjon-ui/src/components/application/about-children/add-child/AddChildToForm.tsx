import { Alert, BodyLong, Box, Button, Heading, HStack, Label, Panel, ReadMore, VStack } from '@navikt/ds-react'
import { fnr as fnrValidator } from '@navikt/fnrvalidator'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import styled from 'styled-components'
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

const ChangeChildPanel = styled(Panel)`
    padding: 0;
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    margin-top: 3rem;
    flex-grow: 1;
    border-radius: 4px;
    border-color: #a0a0a0;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;

    @media screen and (min-width: 650px) {
        max-width: 100%;
    }
`

const ChangeChildPanelHeader = styled.div`
    box-sizing: border-box;
    height: 128px;
    background-color: #4d3e55;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    border-bottom: 4px solid #826ba1;
    display: flex;
    padding: 0;
    position: relative;

    img {
        align-self: flex-end;
        flex: 0 1 auto;
        padding-left: 3em;
    }
`

const Overskrift = styled(Heading)`
    flex: 0 1 auto;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    align-self: center;
    color: white;
`

const ChangeChildPanelContent = styled.div`
    padding: 2em;
`

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
                <ChangeChildPanel>
                    <ChangeChildPanelHeader>
                        <img alt="barn" src={ikon} />
                        <Overskrift size={'small'}>{!isChild ? t('titleModal') : t('aboutTheSiblingTitle')}</Overskrift>
                    </ChangeChildPanelHeader>

                    <ChangeChildPanelContent>
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
                    </ChangeChildPanelContent>
                </ChangeChildPanel>
            </form>
        </FormProvider>
    )
}

export default AddChildToForm
