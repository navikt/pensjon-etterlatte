import { RadioProps } from 'nav-frontend-skjema'
import { FormProvider, useForm } from 'react-hook-form'
import useTranslation from '../../../hooks/useTranslation'
import { ChildRelation, IChild } from '../../../types/person'
import { RHFRadio, RHFGeneralQuestionRadio } from '../../common/rhf/RHFRadio'
import { RHFFoedselsnummerInput, RHFInput, RHFKontonummerInput, RHFProsentInput } from '../../common/rhf/RHFInput'
import { JaNeiVetIkke } from '../../../api/dto/FellesOpplysninger'
import ErrorSummaryWrapper from '../../common/ErrorSummaryWrapper'
import { hentAlderFraFoedselsnummer } from '../../../utils/date'
import { erMyndig } from '../../../utils/age'
import { fnr } from '@navikt/fnrvalidator'
import { Button, Cell, Grid, Heading, Label, Panel } from '@navikt/ds-react'
import { RHFCheckboksPanel } from '../../common/rhf/RHFCheckboksPanelGruppe'
import Hjelpetekst from '../../../utils/Hjelpetekst'
import { RHFSelect } from '../../common/rhf/RHFSelect'
import useCountries from '../../../hooks/useCountries'
import ikon from '../../../assets/barn1.svg'
import { useEffect } from 'react'
import { useUserContext } from '../../../context/user/UserContext'
import FormGroup from '../../common/FormGroup'
import styled from 'styled-components'

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

    @media screen and (min-width: $width) {
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

const NavigationRow = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    column-gap: 1rem;
    margin-bottom: 0rem;
`

interface Props {
    cancel: () => void
    save: (data: IChild) => void
    child: IChild
    fnrRegisteredChild: string[]
    removeCanceledNewChild: () => void
}

const AddChildToForm = ({ cancel, save, child, fnrRegisteredChild, removeCanceledNewChild }: Props) => {
    const { t } = useTranslation('omBarn')
    const { countries }: { countries: any } = useCountries()
    const { state: bruker } = useUserContext()

    const methods = useForm<IChild>({
        defaultValues: {
            ...child,
            statsborgerskap: child.statsborgerskap || 'Norge',
            bosattUtland: { ...child.bosattUtland, land: child.bosattUtland?.land || 'Norge' },
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
        if (child.foedselsnummer === undefined) {
            removeCanceledNewChild()
        }
        cancel()
        window.scrollTo(0, 0)
    }

    const livesAbroadAnswer = watch('bosattUtland.svar')
    const childHasGuardianship = watch('harBarnetVerge.svar')
    const relation = watch('relasjon')
    const foedselsnummer: any = watch('foedselsnummer')
    const appliesForChildrensPension = watch('barnepensjon.soeker')
    const anotherBankAccountChildrensPension = watch('barnepensjon.kontonummer.svar')
    const withholdingTaxChildrensPension = watch('barnepensjon.forskuddstrekk.svar')

    const canApplyForChildrensPension = (): boolean => {
        if (foedselsnummer && fnr(foedselsnummer).status === 'valid') {
            const alder = hentAlderFraFoedselsnummer(foedselsnummer)
            return !erMyndig(alder)
        }

        return false
    }

    const showDuplicateError = () => {
        const isDuplicate = fnrRegisteredChild.includes(foedselsnummer)
        const validationDontShow = errors.foedselsnummer === undefined
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
                            {t('tittelModal')}
                        </Heading>
                    </ChangeChildPanelHeader>
                    <br />

                    <ChangeChildPanelContent>
                        <FormGroup>
                            <FormGroup>
                                <Grid>
                                    <Cell xs={12} md={6}>
                                        <RHFInput name={'fornavn'} label={t('fornavn')} rules={{ pattern: /^\D+$/ }} />
                                    </Cell>

                                    <Cell xs={12} md={6}>
                                        <RHFInput
                                            name={'etternavn'}
                                            label={t('etternavn')}
                                            rules={{ pattern: /^\D+$/ }}
                                        />
                                    </Cell>
                                </Grid>
                            </FormGroup>

                            <FormGroup>
                                <RHFFoedselsnummerInput
                                    name={'foedselsnummer'}
                                    bredde={'L'}
                                    label={t('foedselsnummer')}
                                    placeholder={t('felles.fnrPlaceholder')}
                                    rules={{
                                        validate: {
                                            validate: (value) => {
                                                return fnr(value).status === 'valid'
                                            },
                                            duplicate: (value) => {
                                                return !fnrRegisteredChild.includes(value)
                                            },
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
                                name={`statsborgerskap`}
                                label={t('statsborgerskap')}
                                value={'Norge'}
                                selectOptions={countries}
                            />
                        </FormGroup>

                        <FormGroup>
                            <RHFGeneralQuestionRadio name={'bosattUtland.svar'} legend={t('bosattUtland.svar')} />

                            {livesAbroadAnswer === JaNeiVetIkke.JA && (
                                <>
                                    <RHFSelect
                                        name={'bosattUtland.land'}
                                        label={t('bosattUtland.land')}
                                        value={'Norge'}
                                        selectOptions={countries}
                                    />

                                    <RHFInput name={'bosattUtland.adresse'} label={t('bosattUtland.adresse')} />
                                </>
                            )}
                        </FormGroup>

                        <FormGroup>
                            <RHFRadio
                                name={'relasjon'}
                                legend={
                                    <>
                                        {t('relasjon')}&nbsp;
                                        <Hjelpetekst>{t('relasjonHjelpetekst')} </Hjelpetekst>
                                    </>
                                }
                                radios={Object.values(ChildRelation).map((value) => {
                                    return { label: t(value), value, required: true } as RadioProps
                                })}
                            />
                        </FormGroup>
                        {relation === ChildRelation.fellesbarnMedAvdoede && canApplyForChildrensPension() && (
                            <>
                                <FormGroup>
                                    <RHFGeneralQuestionRadio
                                        name={'harBarnetVerge.svar'}
                                        legend={t('harBarnetVerge.svar')}
                                    />

                                    {childHasGuardianship === JaNeiVetIkke.JA && (
                                        <>
                                            <Label>{t('harBarnetVerge.navn')}</Label>
                                            <Grid>
                                                <Cell xs={12} md={6}>
                                                    <RHFInput
                                                        name={'harBarnetVerge.fornavn'}
                                                        label={t('harBarnetVerge.fornavn')}
                                                        rules={{ pattern: /^\D+$/ }}
                                                        valgfri={true}
                                                    />
                                                </Cell>
                                                <Cell xs={12} md={6}>
                                                    <RHFInput
                                                        name={'harBarnetVerge.etternavn'}
                                                        label={t('harBarnetVerge.etternavn')}
                                                        rules={{ pattern: /^\D+$/ }}
                                                        valgfri={true}
                                                    />
                                                </Cell>
                                            </Grid>
                                            <RHFFoedselsnummerInput
                                                name={'harBarnetVerge.foedselsnummer'}
                                                bredde={'L'}
                                                label={t('harBarnetVerge.foedselsnummer')}
                                                placeholder={t('harBarnetVerge.foedselsnummerPlaceholder')}
                                                valgfri={true}
                                            />
                                        </>
                                    )}
                                </FormGroup>

                                <FormGroup>
                                    <RHFCheckboksPanel
                                        name={'barnepensjon.soeker'}
                                        legend={t('barnepensjon.soeker')}
                                        description={t('barnepensjon.soekerInfo')}
                                        valgfri={true}
                                        checkbox={{
                                            label: t('barnepensjon.soekerCheckboks'),
                                            value: JaNeiVetIkke.JA,
                                        }}
                                    />

                                    {!bruker.adressebeskyttelse && appliesForChildrensPension === JaNeiVetIkke.JA && (
                                        <>
                                            <RHFGeneralQuestionRadio
                                                name={'barnepensjon.kontonummer.svar'}
                                                legend={t('barnepensjon.kontonummer.svar')}
                                            />

                                            {anotherBankAccountChildrensPension === JaNeiVetIkke.NEI && (
                                                <RHFKontonummerInput
                                                    name={'barnepensjon.kontonummer.kontonummer'}
                                                    bredde={'M'}
                                                    label={t('barnepensjon.kontonummer.kontonummer')}
                                                    placeholder={t('barnepensjon.kontonummer.placeholder')}
                                                    description={t('barnepensjon.kontonummer.informasjon')}
                                                />
                                            )}

                                            {anotherBankAccountChildrensPension !== JaNeiVetIkke.VET_IKKE && (
                                                <RHFGeneralQuestionRadio
                                                    name={'barnepensjon.forskuddstrekk.svar'}
                                                    legend={
                                                        <>
                                                            {t('barnepensjon.forskuddstrekk.svar')}&nbsp;
                                                            <Hjelpetekst>
                                                                {t('barnepensjon.forskuddstrekk.hjelpetekst')}
                                                            </Hjelpetekst>
                                                        </>
                                                    }
                                                />
                                            )}

                                            {withholdingTaxChildrensPension === JaNeiVetIkke.JA && (
                                                <RHFProsentInput
                                                    bredde={'M'}
                                                    name={'barnepensjon.forskuddstrekk.trekkprosent'}
                                                    label={t('barnepensjon.forskuddstrekk.trekkprosent')}
                                                    placeholder={t('barnepensjon.forskuddstrekk.placeholder')}
                                                />
                                            )}
                                        </>
                                    )}
                                </FormGroup>
                            </>
                        )}

                        {(relation === ChildRelation.egneSaerkullsbarn ||
                            relation == ChildRelation.avdoedesSaerkullsbarn) && (
                            <FormGroup>
                                <RHFGeneralQuestionRadio name={'dagligOmsorg'} legend={t('dagligOmsorg')} />
                            </FormGroup>
                        )}

                        <ErrorSummaryWrapper errors={errors} />

                        <NavigationRow>
                            <Button
                                id={'avbrytLeggTilBarn'}
                                variant={'secondary'}
                                type={'button'}
                                onClick={cancelAndClose}
                                style={{ minWidth: '80px' }}
                            >
                                {t('knapp.avbryt')}
                            </Button>

                            <Button
                                id={'leggTilBarn'}
                                variant={'primary'}
                                type={'button'}
                                onClick={handleSubmit(addAndClose)}
                                style={{ minWidth: '80px' }}
                            >
                                {t('knapp.lagre')}
                            </Button>
                        </NavigationRow>
                    </ChangeChildPanelContent>
                </ChangeChildPanel>
            </form>
        </FormProvider>
    )
}

export default AddChildToForm
