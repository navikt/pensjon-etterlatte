import { Alert, BodyLong, Button, Heading, Label, Panel } from '@navikt/ds-react'
import { fnr as fnrValidator } from '@navikt/fnrvalidator'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import styled from 'styled-components'
import { JaNeiVetIkke } from '../../../../api/dto/FellesOpplysninger'
import ikon from '../../../../assets/barn1.svg'
import useCountries from '../../../../hooks/useCountries'
import useTranslation from '../../../../hooks/useTranslation'
import { IChild } from '../../../../types/person'
import { getAgeFromFoedselsnummer, isLegalAge } from '../../../../utils/age'
import ErrorSummaryWrapper from '../../../common/ErrorSummaryWrapper'
import FormGroup from '../../../common/FormGroup'
import { NavRow } from '../../../common/Navigation'
import { RHFConfirmationPanel } from '../../../common/rhf/RHFCheckboksPanelGruppe'
import PaymentDetails from '../../../common/PaymentDetails'
import { GuardianDetails } from './GuardianDetails'
import { LivesAbroadQuestion } from './LivesAbroadQuestion'
import PersonInfo from '../../../common/PersonInfo'
import { ParentQuestion } from './ParentQuestion'
import { IsGuardianQuestion } from './IsGuardianQuestion'

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
    cancel: () => void
    save: (data: IChild) => void
    child: IChild
    fnrRegisteredChild: string[]
    removeCanceledNewChild: () => void
    isChild: boolean
    isGuardian: boolean
}

const AddChildToForm = ({
    cancel,
    save,
    child,
    fnrRegisteredChild,
    removeCanceledNewChild,
    isChild,
    isGuardian,
}: Props) => {
    const { t } = useTranslation('aboutChildren')
    const { countries }: { countries: any } = useCountries()

    const methods = useForm<IChild>({
        defaultValues: {
            ...child,
            citizenship: child.citizenship || 'Norge',
            staysAbroad: { ...child.staysAbroad, country: child.staysAbroad?.country || 'Norge' },
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
        if (child.fnrDnr === undefined) removeCanceledNewChild()
        cancel()
        window.scrollTo(0, 0)
    }

    const bothParents = watch('bothParents')
    const fnr: any = watch('fnrDnr')
    const appliesForChildrensPension: boolean | undefined = watch('appliesForChildrensPension')
    const loggedInUserIsGuardian = watch('loggedInUserIsGuardian')

    const canApplyForChildrensPension = (): boolean => {
        if (bothParents === JaNeiVetIkke.JA && fnr && fnrValidator(fnr).status === 'valid') {
            const alder = getAgeFromFoedselsnummer(fnr)
            if (!isGuardian || loggedInUserIsGuardian === JaNeiVetIkke.JA) return !isLegalAge(alder)
        }

        return false
    }

    const tooOldChild = () => {
        return fnr && fnrValidator(fnr).status === 'valid' && getAgeFromFoedselsnummer(fnr) >= 21
    }

    const childIsRelevantForApplication = () => {
        // Only full sublings should be added
        if (bothParents === JaNeiVetIkke.NEI) return false

        // We only need to know about children up to 21 years old
        return !tooOldChild()
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
                                    <Alert inline={true} variant={'error'}>
                                        <BodyLong>{t('onlyChildrenUnder22Necessary')}</BodyLong>
                                    </Alert>
                                </Panel>
                            )}
                        </FormGroup>
                        {!tooOldChild() && (
                            <FormGroup>
                                <ParentQuestion isChild={isChild} isGuardian={isGuardian} t={t} watch={watch} />
                                {isChild && bothParents === JaNeiVetIkke.JA && (
                                    <LivesAbroadQuestion isChild={isChild} countries={countries} t={t} watch={watch} />
                                )}
                                {!isChild && bothParents === JaNeiVetIkke.JA && (
                                    <>
                                        <FormGroup>
                                            <LivesAbroadQuestion
                                                isChild={isChild}
                                                countries={countries}
                                                t={t}
                                                watch={watch}
                                            />
                                            <IsGuardianQuestion isGuardian={isGuardian} t={t} watch={watch} />
                                        </FormGroup>

                                        {canApplyForChildrensPension() && (
                                            <>
                                                <GuardianDetails isGuardian={isGuardian} t={t} watch={watch} />

                                                <FormGroup>
                                                    <Label>{t('applyForThisChild')}</Label>
                                                    <RHFConfirmationPanel
                                                        name={'appliesForChildrensPension'}
                                                        label={t('userAppliesForChildrensPension')}
                                                        valgfri={true}
                                                        size={'medium'}
                                                    />
                                                </FormGroup>

                                                {appliesForChildrensPension && <PaymentDetails />}
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

                            {childIsRelevantForApplication() && (
                                <Button
                                    id={'addChildren'}
                                    variant={'primary'}
                                    type={'button'}
                                    onClick={handleSubmit(addAndClose)}
                                    style={{ minWidth: '80px' }}
                                >
                                    {t('saveButton', { ns: 'btn' })}
                                </Button>
                            )}
                        </NavRow>
                    </ChangeChildPanelContent>
                </ChangeChildPanel>
            </form>
        </FormProvider>
    )
}

export default AddChildToForm
