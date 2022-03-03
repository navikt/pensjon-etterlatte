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
import ErrorSummaryWrapper from '../../common/ErrorSummaryWrapper'
import FormGroup from '../../common/FormGroup'
import { NavRow } from '../../common/Navigation'
import { RHFCheckboksPanel } from '../../common/rhf/RHFCheckboksPanelGruppe'
import { RHFFoedselsnummerInput, RHFInput, RHFKontonummerInput, RHFProsentInput } from '../../common/rhf/RHFInput'
import { RHFGeneralQuestionRadio, RHFRadio } from '../../common/rhf/RHFRadio'
import { RHFSelect } from '../../common/rhf/RHFSelect'
import WhyWeAsk from '../../common/WhyWeAsk'
import FormElement from '../../common/FormElement'

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
                    <ChangeChildPanelContent>
                        <FormGroup>
                            <FormElement>
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
                            </FormElement>
                            <FormElement>
                                <Grid>
                                    <Cell xs={12} md={6}>
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
                                        {showDuplicateError() && (
                                            <p className={'typo-feilmelding'}>{t('feil.foedselsnummer.duplicate')}</p>
                                        )}
                                    </Cell>
                                    <Cell xs={12} md={6}>
                                        <RHFSelect
                                            className="kol-50"
                                            name={`citizenship`}
                                            label={t('citizenship')}
                                            value={'Norge'}
                                            selectOptions={countries}
                                        />
                                    </Cell>
                                </Grid>
                            </FormElement>
                        </FormGroup>

                        <FormGroup>
                            <FormElement>
                                <RHFGeneralQuestionRadio
                                    name={'staysAbroad.answer'}
                                    legend={!isChild ? t('staysAbroad.answer') : t('staysAbroad.sibling.answer')}
                                />
                            </FormElement>

                            {livesAbroadAnswer === JaNeiVetIkke.JA && (
                                <>
                                    <FormElement>
                                        <RHFSelect
                                            name={'staysAbroad.country'}
                                            label={t('staysAbroad.country')}
                                            selectOptions={countries}
                                        />
                                    </FormElement>

                                    <FormElement>
                                        <RHFInput name={'staysAbroad.address'} label={t('staysAbroad.address')} />
                                    </FormElement>
                                </>
                            )}
                        </FormGroup>

                        {!isChild && !isGuardian && (
                            <FormGroup>
                                <RHFRadio
                                    name={'relation'}
                                    legend={t('relation')}
                                    description={<WhyWeAsk title={'relation'}>{t('relationHelpText')}</WhyWeAsk>}
                                    radios={Object.values(ChildRelation).map((value) => {
                                        return { label: t(value), value, required: true } as RadioProps
                                    })}
                                />
                            </FormGroup>
                        )}
                        {relation === ChildRelation.fellesbarnMedAvdoede && canApplyForChildrensPension() && (
                            <>
                                <FormGroup>
                                    <FormElement>
                                        <RHFGeneralQuestionRadio
                                            name={'childHasGuardianship.answer'}
                                            legend={t('childHasGuardianship.answer')}
                                        />
                                    </FormElement>

                                    {childHasGuardianship === JaNeiVetIkke.JA && (
                                        <>
                                            <Label>{t('childHasGuardianship.name')}</Label>
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
                                            <FormElement>
                                                <RHFFoedselsnummerInput
                                                    name={'childHasGuardianship.fnr'}
                                                    bredde={'L'}
                                                    label={t('childHasGuardianship.fnr')}
                                                    placeholder={t('childHasGuardianship.fnrPlaceholder')}
                                                    valgfri={true}
                                                />
                                            </FormElement>
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
                                            <FormGroup>
                                                <FormElement>
                                                    <RHFGeneralQuestionRadio
                                                        name={'childrensPension.bankAccount.answer'}
                                                        legend={t('childrensPension.bankAccount.answer')}
                                                    />
                                                </FormElement>

                                                {anotherBankAccountChildrensPension === JaNeiVetIkke.NEI && (
                                                    <FormElement>
                                                        <RHFKontonummerInput
                                                            name={'childrensPension.bankAccount.bankAccount'}
                                                            bredde={'M'}
                                                            label={t('childrensPension.bankAccount.bankAccount')}
                                                            placeholder={t('childrensPension.bankAccount.placeholder')}
                                                            description={t('childrensPension.bankAccount.information')}
                                                        />
                                                    </FormElement>
                                                )}
                                            </FormGroup>
                                            <FormGroup>
                                                {anotherBankAccountChildrensPension !== JaNeiVetIkke.VET_IKKE && (
                                                    <FormElement>
                                                        <RHFGeneralQuestionRadio
                                                            name={'childrensPension.taxWithhold.answer'}
                                                            legend={t('childrensPension.taxWithhold.answer')}
                                                            description={
                                                                <WhyWeAsk title={'tax'}>
                                                                    {t('childrensPension.taxWithhold.helpText')}
                                                                </WhyWeAsk>
                                                            }
                                                        />
                                                    </FormElement>
                                                )}

                                                {withholdingTaxChildrensPension === JaNeiVetIkke.JA && (
                                                    <FormElement>
                                                        <RHFProsentInput
                                                            bredde={'M'}
                                                            name={'childrensPension.taxWithhold.trekkprosent'}
                                                            label={t('childrensPension.taxWithhold.trekkprosent')}
                                                            placeholder={t('childrensPension.taxWithhold.placeholder')}
                                                        />
                                                    </FormElement>
                                                )}
                                            </FormGroup>
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
                                id={'cancelAddChildren'}
                                variant={'secondary'}
                                type={'button'}
                                onClick={cancelAndClose}
                                style={{ minWidth: '80px' }}
                            >
                                {t('btn.cancel')}
                            </Button>

                            <Button
                                id={'addChildren'}
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
