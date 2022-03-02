import { Button, Cell, Grid, Heading, Label, Panel } from '@navikt/ds-react'
import { fnr as fnrValidator } from '@navikt/fnrvalidator'
import { RadioProps } from 'nav-frontend-skjema'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import styled from 'styled-components'
import { JaNeiVetIkke } from '../../../api/dto/FellesOpplysninger'
import ikon from '../../../assets/barn1.svg'
import { useUserContext } from '../../../context/user/UserContext'
import useCountries from '../../../hooks/useCountries'
import useTranslation from '../../../hooks/useTranslation'
import { ChildRelation, IChild } from '../../../types/person'
import { erMyndig } from '../../../utils/age'
import { hentAlderFraFoedselsnummer } from '../../../utils/date'
import Hjelpetekst from '../../../utils/Hjelpetekst'
import ErrorSummaryWrapper from '../../common/ErrorSummaryWrapper'
import FormGroup from '../../common/FormGroup'
import { NavRow } from '../../common/Navigation'
import { RHFCheckboksPanel } from '../../common/rhf/RHFCheckboksPanelGruppe'
import { RHFFoedselsnummerInput, RHFInput, RHFKontonummerInput, RHFProsentInput } from '../../common/rhf/RHFInput'
import { RHFGeneralQuestionRadio, RHFRadio } from '../../common/rhf/RHFRadio'
import { RHFSelect } from '../../common/rhf/RHFSelect'

const ChangeChildPanel = styled(Panel)`
    padding: 0;
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
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

    .overskrift {
        flex: 0 1 auto;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        align-self: center;
        color: white;
    }
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
    const { state: bruker } = useUserContext()

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
        if (child.fnr === undefined) removeCanceledNewChild()
        cancel()
        window.scrollTo(0, 0)
    }

    const livesAbroadAnswer = watch('staysAbroad.answer')
    const childHasGuardianship = watch('childHasGuardianship.answer')
    const relation = watch('relation')
    const fnr: any = watch('fnr')
    const appliesForChildrensPension = watch('childrensPension.applies')
    const anotherBankAccountChildrensPension = watch('childrensPension.bankAccount.answer')
    const withholdingTaxChildrensPension = watch('childrensPension.taxWithhold.answer')

    const canApplyForChildrensPension = (): boolean => {
        if (fnr && fnrValidator(fnr).status === 'valid') {
            const alder = hentAlderFraFoedselsnummer(fnr)
            return !erMyndig(alder)
        }

        return false
    }

    const showDuplicateError = () => {
        const isDuplicate = fnrRegisteredChild.includes(fnr)
        const validationDontShow = errors.fnr === undefined
        return isDuplicate && validationDontShow
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <FormProvider {...methods}>
            <form>
                <ChangeChildPanel>
                    <ChangeChildPanelHeader>
                        <img alt="barn" className="barneikon" src={ikon} />
                        <Heading size={'small'} className={'overskrift'}>
                            {!isChild ? t('titleModal') : t('titleModal.sibling')}
                        </Heading>
                    </ChangeChildPanelHeader>
                    <br />

                    <ChangeChildPanelContent>
                        <FormGroup>
                            <FormGroup>
                                <Grid>
                                    <Cell xs={12} md={6}>
                                        <RHFInput
                                            name={'firstName'}
                                            label={t('firstName')}
                                            rules={{ pattern: /^\D+$/ }}
                                        />
                                    </Cell>

                                    <Cell xs={12} md={6}>
                                        <RHFInput
                                            name={'lastName'}
                                            label={t('lastName')}
                                            rules={{ pattern: /^\D+$/ }}
                                        />
                                    </Cell>
                                </Grid>
                            </FormGroup>

                            <FormGroup>
                                <RHFFoedselsnummerInput
                                    name={'fnr'}
                                    bredde={'L'}
                                    label={!isChild ? t('fnr') : t('fnr.sibling')}
                                    placeholder={t('common.fnrPlaceholder')}
                                    rules={{
                                        validate: {
                                            validate: (value) => fnrValidator(value).status === 'valid',
                                            duplicate: (value) => !fnrRegisteredChild.includes(value),
                                        },
                                    }}
                                />
                            </FormGroup>
                            {showDuplicateError() && (
                                <FormGroup>
                                    <p className={'typo-feilmelding'}>{t('feil.foedselsnummer.duplicate')}</p>
                                </FormGroup>
                            )}

                            <RHFSelect
                                className="kol-50"
                                name={`citizenship`}
                                label={t('citizenship')}
                                value={'Norge'}
                                selectOptions={countries}
                            />
                        </FormGroup>

                        <FormGroup>
                            <RHFGeneralQuestionRadio
                                name={'staysAbroad.answer'}
                                legend={!isChild ? t('staysAbroad.answer') : t('staysAbroad.sibling.answer')}
                            />

                            {livesAbroadAnswer === JaNeiVetIkke.JA && (
                                <>
                                    <RHFSelect
                                        name={'staysAbroad.country'}
                                        label={t('staysAbroad.country')}
                                        value={'Norge'}
                                        selectOptions={countries}
                                    />

                                    <RHFInput name={'staysAbroad.address'} label={t('staysAbroad.address')} />
                                </>
                            )}
                        </FormGroup>

                        {!isChild && !isGuardian && (
                            <FormGroup>
                                <RHFRadio
                                    name={'relation'}
                                    legend={
                                        <>
                                            {t('relation')}&nbsp;
                                            <Hjelpetekst>{t('relationHelpText')} </Hjelpetekst>
                                        </>
                                    }
                                    radios={Object.values(ChildRelation).map((value) => {
                                        return { label: t(value), value, required: true } as RadioProps
                                    })}
                                />
                            </FormGroup>
                        )}
                        {relation === ChildRelation.fellesbarnMedAvdoede && canApplyForChildrensPension() && (
                            <>
                                <FormGroup>
                                    <RHFGeneralQuestionRadio
                                        name={'childHasGuardianship.answer'}
                                        legend={t('childHasGuardianship.answer')}
                                    />

                                    {childHasGuardianship === JaNeiVetIkke.JA && (
                                        <>
                                            <Label>{t('childHasGuardianship.navn')}</Label>
                                            <Grid>
                                                <Cell xs={12} md={6}>
                                                    <RHFInput
                                                        name={'childHasGuardianship.firstName'}
                                                        label={t('childHasGuardianship.firstName')}
                                                        rules={{ pattern: /^\D+$/ }}
                                                        valgfri={true}
                                                    />
                                                </Cell>
                                                <Cell xs={12} md={6}>
                                                    <RHFInput
                                                        name={'childHasGuardianship.lastName'}
                                                        label={t('childHasGuardianship.lastName')}
                                                        rules={{ pattern: /^\D+$/ }}
                                                        valgfri={true}
                                                    />
                                                </Cell>
                                            </Grid>
                                            <RHFFoedselsnummerInput
                                                name={'childHasGuardianship.fnr'}
                                                bredde={'L'}
                                                label={t('childHasGuardianship.fnr')}
                                                placeholder={t('childHasGuardianship.fnrPlaceholder')}
                                                valgfri={true}
                                            />
                                        </>
                                    )}
                                </FormGroup>

                                <FormGroup>
                                    <RHFCheckboksPanel
                                        name={'childrensPension.applies'}
                                        legend={t('childrensPension.applies')}
                                        description={t('childrensPension.appliesInfo')}
                                        valgfri={true}
                                        checkbox={{
                                            label: t('childrensPension.appliesCheckbox'),
                                            value: JaNeiVetIkke.JA,
                                        }}
                                    />

                                    {!bruker.adressebeskyttelse && appliesForChildrensPension === JaNeiVetIkke.JA && (
                                        <>
                                            <RHFGeneralQuestionRadio
                                                name={'childrensPension.bankAccount.answer'}
                                                legend={t('childrensPension.bankAccount.answer')}
                                            />

                                            {anotherBankAccountChildrensPension === JaNeiVetIkke.NEI && (
                                                <RHFKontonummerInput
                                                    name={'childrensPension.bankAccount.bankAccount'}
                                                    bredde={'M'}
                                                    label={t('childrensPension.bankAccount.bankAccount')}
                                                    placeholder={t('childrensPension.bankAccount.placeholder')}
                                                    description={t('childrensPension.bankAccount.information')}
                                                />
                                            )}

                                            {anotherBankAccountChildrensPension !== JaNeiVetIkke.VET_IKKE && (
                                                <RHFGeneralQuestionRadio
                                                    name={'childrensPension.taxWithhold.answer'}
                                                    legend={
                                                        <>
                                                            {t('childrensPension.taxWithhold.answer')}&nbsp;
                                                            <Hjelpetekst>
                                                                {t('childrensPension.taxWithhold.helpText')}
                                                            </Hjelpetekst>
                                                        </>
                                                    }
                                                />
                                            )}

                                            {withholdingTaxChildrensPension === JaNeiVetIkke.JA && (
                                                <RHFProsentInput
                                                    bredde={'M'}
                                                    name={'childrensPension.taxWithhold.trekkprosent'}
                                                    label={t('childrensPension.taxWithhold.trekkprosent')}
                                                    placeholder={t('childrensPension.taxWithhold.placeholder')}
                                                />
                                            )}
                                        </>
                                    )}
                                </FormGroup>
                            </>
                        )}

                        {(relation === ChildRelation.egneSaerkullsbarn ||
                            relation === ChildRelation.avdoedesSaerkullsbarn) && (
                            <FormGroup>
                                <RHFGeneralQuestionRadio name={'dailyCare'} legend={t('dailyCare')} />
                            </FormGroup>
                        )}

                        <ErrorSummaryWrapper errors={errors} />

                        <NavRow>
                            <Button
                                id={'avbrytLeggTilBarn'}
                                variant={'secondary'}
                                type={'button'}
                                onClick={cancelAndClose}
                                style={{ minWidth: '80px' }}
                            >
                                {t('btn.cancel')}
                            </Button>

                            <Button
                                id={'leggTilBarn'}
                                variant={'primary'}
                                type={'button'}
                                onClick={handleSubmit(addAndClose)}
                                style={{ minWidth: '80px' }}
                            >
                                {t('btn.save')}
                            </Button>
                        </NavRow>
                    </ChangeChildPanelContent>
                </ChangeChildPanel>
            </form>
        </FormProvider>
    )
}

export default AddChildToForm
