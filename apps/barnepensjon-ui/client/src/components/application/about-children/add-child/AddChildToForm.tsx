import { Alert, BodyLong, Button, Heading, Label, Panel } from '@navikt/ds-react'
import { fnr as fnrValidator } from '@navikt/fnrvalidator'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import styled from 'styled-components'
import { JaNeiVetIkke } from '../../../../api/dto/FellesOpplysninger'
import ikon from '../../../../assets/barn1.svg'
import useCountries from '../../../../hooks/useCountries'
import useTranslation from '../../../../hooks/useTranslation'
import { IChild, ParentRelationType } from '../../../../types/person'
import { getAgeFromFoedselsnummer, isLegalAge } from '../../../../utils/age'
import ErrorSummaryWrapper from '../../../common/ErrorSummaryWrapper'
import FormGroup from '../../../common/FormGroup'
import { NavRow } from '../../../common/Navigation'
import { RHFConfirmationPanel } from '../../../common/rhf/RHFCheckboksPanelGruppe'
import PaymentDetails from '../../../common/PaymentDetails'
import { GuardianDetails } from './GuardianDetails'
import { LivesAbroadQuestion } from './LivesAbroadQuestion'
import PersonInfo from '../../../common/PersonInfo'
import ParentQuestion from './ParentQuestion'
import { IsGuardianQuestion } from './IsGuardianQuestion'
import { useUserContext } from '../../../../context/user/UserContext'

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

const AddChildToForm = ({ cancel, save, child, fnrRegisteredChild, isChild, isGuardian }: Props) => {
    const { t } = useTranslation('aboutChildren')
    const { countries }: { countries: any } = useCountries()
    const { state: user } = useUserContext()

    const methods = useForm<IChild>({
        defaultValues: {
            ...child,
        },
        shouldUnregister: true,
    })

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

    const cancelAndClose = () => {
        if (child.fnrDnr === undefined) cancel(true)
        else cancel()
        window.scrollTo(0, 0)
    }

    const parents = watch('parents')
    const fnr: any = watch('fnrDnr')
    const appliesForChildrensPension: boolean | undefined = watch('appliesForChildrensPension')
    const childHasGuardianship = watch('childHasGuardianship.answer')
    const loggedInUserIsGuardian = watch('loggedInUserIsGuardian')
    const livesAbroadAnswer = watch('staysAbroad.answer')

    const canApplyForChildrensPension = (): boolean => {
        if (parents === ParentRelationType.BOTH && fnr && fnrValidator(fnr).status === 'valid') {
            const alder = getAgeFromFoedselsnummer(fnr)
            if (!isGuardian || loggedInUserIsGuardian === JaNeiVetIkke.JA) return !isLegalAge(alder)
        }

        return false
    }

    const tooOldChild = () => {
        return fnr && fnrValidator(fnr).status === 'valid' && getAgeFromFoedselsnummer(fnr) >= 18
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <FormProvider {...methods}>
            <form>
                <ChangeChildPanel>
                    <ChangeChildPanelHeader>
                        <img alt="barn" src={ikon} />
                        <Overskrift size={'small'}>{!isChild ? t('titleModal') : t('aboutTheSiblingTitle')}</Overskrift>
                    </ChangeChildPanelHeader>

                    <ChangeChildPanelContent>
                        <FormGroup>
                            <PersonInfo duplicateList={fnrRegisteredChild} />
                            {tooOldChild() && (
                                <Panel border>
                                    <Alert id={'above18Warning'} inline={true} variant={'info'}>
                                        <BodyLong>{t('onlyChildrenUnder18Necessary')}</BodyLong>
                                    </Alert>
                                </Panel>
                            )}
                            <ParentQuestion parents={parents} />
                        </FormGroup>

                        {!tooOldChild() && parents === ParentRelationType.BOTH && (
                            <FormGroup>
                                {isChild && !user.adressebeskyttelse && (
                                    <LivesAbroadQuestion
                                        isChild={isChild}
                                        countries={countries}
                                        livesAbroadAnswer={livesAbroadAnswer}
                                    />
                                )}
                                {!isChild && (
                                    <>
                                        <FormGroup>
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
                                        </FormGroup>

                                        {canApplyForChildrensPension() && (
                                            <>
                                                <GuardianDetails
                                                    isGuardian={isGuardian}
                                                    childHasGuardianship={childHasGuardianship}
                                                />

                                                <FormGroup>
                                                    <Label>{t('applyForThisChild')}</Label>
                                                    <RHFConfirmationPanel
                                                        name={'appliesForChildrensPension'}
                                                        label={t('userAppliesForChildrensPension')}
                                                        valgfri={true}
                                                        size={'medium'}
                                                    />
                                                </FormGroup>

                                                {!user.adressebeskyttelse && appliesForChildrensPension && (
                                                    <PaymentDetails />
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </FormGroup>
                        )}

                        <ErrorSummaryWrapper errors={errors} />

                        <NavRow>
                            <Button
                                id={'cancelAddChildren'}
                                variant={'secondary'}
                                type={'button'}
                                onClick={cancelAndClose}
                                style={{ minWidth: '80px' }}
                            >
                                {t('cancelButton', { ns: 'btn' })}
                            </Button>

                            <Button
                                id={'addChildren'}
                                variant={'primary'}
                                type={'button'}
                                onClick={handleSubmit(addAndClose)}
                                style={{ minWidth: '80px' }}
                            >
                                {t('saveButton', { ns: 'btn' })}
                            </Button>
                        </NavRow>
                    </ChangeChildPanelContent>
                </ChangeChildPanel>
            </form>
        </FormProvider>
    )
}

export default AddChildToForm
