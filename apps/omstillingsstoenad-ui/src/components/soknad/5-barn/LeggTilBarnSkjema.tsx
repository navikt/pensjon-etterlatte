import { SkjemaGruppe } from '../../felles/SkjemaGruppe'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BarnRelasjon, IBarn } from '../../../typer/person'
import { RHFRadio, RHFSpoersmaalRadio } from '../../felles/rhf/RHFRadio'
import { RHFFoedselsnummerInput, RHFInput, RHFKontonummerInput, RHFProsentInput } from '../../felles/rhf/RHFInput'
import { IValg } from '../../../typer/Spoersmaal'
import Feilmeldinger from '../../felles/Feilmeldinger'
import { hentAlderFraFoedselsnummer } from '../../../utils/dato'
import { erMyndig } from '../../../utils/alder'
import { fnr } from '@navikt/fnrvalidator'
import { Alert, BodyShort, Button, Cell, Grid, Heading, HelpText, Label, Panel, RadioProps } from '@navikt/ds-react'
import { RHFConfirmationPanel } from '../../felles/rhf/RHFCheckboksPanelGruppe'
import { RHFSelect } from '../../felles/rhf/RHFSelect'
import { useLand } from '../../../hooks/useLand'
import ikon from '../../../assets/ikoner/barn1.svg'
import { useEffect } from 'react'
import { useBrukerContext } from '../../../context/bruker/BrukerContext'
import styled from 'styled-components'
import { NavigasjonsRad, SkjemaGruppeRad } from '../../felles/StyledComponents'
import { SkjemaElement } from '../../felles/SkjemaElement'
import Bredde from '../../../typer/bredde'

const HelpTextLabel = styled.div`
    display: flex;
`

const EndreBarnKort = styled(Panel)`
    padding: 0;
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    flex-grow: 1;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;

    @media screen and (min-width: 650px) {
        max-width: 100%;
    }
`

const EndreBarnKortHeader = styled.header`
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

const EndreBarnKortInnhold = styled.div`
    padding: 2em;
`

const TypoFeilmelding = styled.p`
    color: #ba3a26;
    font-weight: 600;
`

interface Props {
    avbryt: () => void
    lagre: (data: IBarn) => void
    barn: IBarn
    fnrRegistrerteBarn: string[]
    fjernAvbruttNyttBarn: () => void
}

const LeggTilBarnSkjema = ({ avbryt, lagre, barn, fnrRegistrerteBarn, fjernAvbruttNyttBarn }: Props) => {
    const { t } = useTranslation()
    const { land }: { land: any } = useLand()
    const { state: bruker } = useBrukerContext()

    const methods = useForm<IBarn>({
        defaultValues: {
            ...barn,
            statsborgerskap: barn.statsborgerskap,
            bosattUtland: { ...barn.bosattUtland, land: barn.bosattUtland?.land },
        },
        shouldUnregister: true,
    })

    const {
        formState: { errors },
        handleSubmit,
        reset,
        watch,
    } = methods

    const leggTilOgLukk = (data: IBarn) => {
        lagre(data)
        reset()
        window.scrollTo(0, 0)
    }

    const avbrytOgLukk = () => {
        if (barn.foedselsnummer === undefined) {
            fjernAvbruttNyttBarn()
        }
        avbryt()
        window.scrollTo(0, 0)
    }

    const bosattUtlandSvar = watch('bosattUtland.svar')
    const harBarnetVerge = watch('harBarnetVerge.svar')
    const relasjon = watch('relasjon')
    const foedselsnummer: any = watch('foedselsnummer')
    const soekerBarnepensjon = watch('barnepensjon.soeker')
    const annetKontonummerBarnepensjon = watch('barnepensjon.kontonummer.svar')
    const forskuddstrekkBarnepensjon = watch('barnepensjon.forskuddstrekk.svar')

    const kanSoekeOmBarnepensjon = (): boolean => {
        if (foedselsnummer && fnr(foedselsnummer).status === 'valid') {
            const alder = hentAlderFraFoedselsnummer(foedselsnummer)
            return !erMyndig(alder)
        }

        return false
    }

    const visDuplikatFeilmelding = () => {
        const erDuplikat = fnrRegistrerteBarn.includes(foedselsnummer)
        const valideringVisesIkke = errors.foedselsnummer === undefined
        return erDuplikat && valideringVisesIkke
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <FormProvider {...methods}>
            <form>
                <EndreBarnKort border>
                    <EndreBarnKortHeader>
                        <img alt="barn" src={ikon} />
                        <Heading size={'small'} className={'overskrift'}>
                            {t('omBarn.tittelModal')}
                        </Heading>
                    </EndreBarnKortHeader>
                    <br />

                    <EndreBarnKortInnhold>
                        <SkjemaGruppe>
                            <SkjemaElement>
                                <SkjemaGruppeRad>
                                    <div className={'kol-50'}>
                                        <RHFInput
                                            name={'fornavn'}
                                            label={t('omBarn.fornavn')}
                                            rules={{ pattern: /^\D+$/ }}
                                        />
                                    </div>

                                    <div className={'kol-50'}>
                                        <RHFInput
                                            name={'etternavn'}
                                            label={t('omBarn.etternavn')}
                                            rules={{ pattern: /^\D+$/ }}
                                        />
                                    </div>
                                </SkjemaGruppeRad>
                            </SkjemaElement>
                            <SkjemaElement>
                                <RHFFoedselsnummerInput
                                    name={'foedselsnummer'}
                                    htmlSize={Bredde.S}
                                    label={t('omBarn.foedselsnummer')}
                                    placeholder={t('felles.fnrPlaceholder')}
                                    rules={{
                                        validate: {
                                            validate: (value) => {
                                                return fnr(value).status === 'valid'
                                            },
                                            duplicate: (value) => {
                                                return !fnrRegistrerteBarn.includes(value)
                                            },
                                        },
                                    }}
                                />
                            </SkjemaElement>

                            {visDuplikatFeilmelding() && (
                                <SkjemaGruppe>
                                    <TypoFeilmelding>{t('feil.foedselsnummer.duplicate')}</TypoFeilmelding>
                                </SkjemaGruppe>
                            )}

                            <RHFSelect
                                className="kol-50"
                                name={`statsborgerskap`}
                                label={t('omBarn.statsborgerskap')}
                                value={'Norge'}
                                selectOptions={land}
                            />
                        </SkjemaGruppe>

                        <SkjemaGruppe>
                            <RHFSpoersmaalRadio name={'bosattUtland.svar'} legend={t('omBarn.bosattUtland.svar')} />

                            {bosattUtlandSvar === IValg.JA && (
                                <>
                                    <SkjemaElement>
                                        <RHFSelect
                                            name={'bosattUtland.land'}
                                            label={t('omBarn.bosattUtland.land')}
                                            value={'Norge'}
                                            selectOptions={land}
                                        />
                                    </SkjemaElement>
                                    <RHFInput name={'bosattUtland.adresse'} label={t('omBarn.bosattUtland.adresse')} />
                                </>
                            )}
                        </SkjemaGruppe>

                        <SkjemaGruppe>
                            <RHFRadio
                                name={'relasjon'}
                                legend={
                                    <HelpTextLabel>
                                        {t('omBarn.relasjon')}&nbsp;
                                        <HelpText>{t('omBarn.relasjonHjelpetekst')} </HelpText>
                                    </HelpTextLabel>
                                }
                            >
                                {Object.values(BarnRelasjon).map((value) => {
                                    return { children: t(value), value, required: true } as RadioProps
                                })}
                            </RHFRadio>
                        </SkjemaGruppe>
                        {relasjon === BarnRelasjon.fellesbarnMedAvdoede && kanSoekeOmBarnepensjon() && (
                            <>
                                <SkjemaGruppe>
                                    <SkjemaElement>
                                        <RHFSpoersmaalRadio
                                            name={'harBarnetVerge.svar'}
                                            legend={t('omBarn.harBarnetVerge.svar')}
                                        />
                                    </SkjemaElement>

                                    {harBarnetVerge === IValg.JA && (
                                        <>
                                            <Label>{t('omBarn.harBarnetVerge.navn')}</Label>
                                            <SkjemaElement>
                                                <Grid>
                                                    <Cell xs={12} md={6}>
                                                        <RHFInput
                                                            name={'harBarnetVerge.fornavn'}
                                                            label={t('omBarn.harBarnetVerge.fornavn')}
                                                            rules={{ pattern: /^\D+$/ }}
                                                            valgfri={true}
                                                        />
                                                    </Cell>
                                                    <Cell xs={12} md={6}>
                                                        <RHFInput
                                                            name={'harBarnetVerge.etternavn'}
                                                            label={t('omBarn.harBarnetVerge.etternavn')}
                                                            rules={{ pattern: /^\D+$/ }}
                                                            valgfri={true}
                                                        />
                                                    </Cell>
                                                </Grid>
                                            </SkjemaElement>
                                            <RHFFoedselsnummerInput
                                                name={'harBarnetVerge.foedselsnummer'}
                                                htmlSize={Bredde.S}
                                                label={t('omBarn.harBarnetVerge.foedselsnummer')}
                                                placeholder={t('omBarn.harBarnetVerge.foedselsnummerPlaceholder')}
                                                valgfri={true}
                                            />
                                        </>
                                    )}
                                </SkjemaGruppe>

                                <SkjemaGruppe>
                                    <SkjemaElement>
                                        <Label>{t('omBarn.barnepensjon.soekerInfo')}</Label>
                                        <RHFConfirmationPanel
                                            name={'barnepensjon.soeker'}
                                            label={t('omBarn.barnepensjon.soeker')}
                                            valgfri={true}
                                            size={'medium'}
                                        />
                                    </SkjemaElement>

                                    {!bruker.adressebeskyttelse && soekerBarnepensjon && (
                                        <>
                                            <SkjemaGruppe>
                                                <SkjemaElement>
                                                    <RHFSpoersmaalRadio
                                                        name={'barnepensjon.kontonummer.svar'}
                                                        legend={t('omBarn.barnepensjon.kontonummer.svar')}
                                                    />
                                                </SkjemaElement>

                                                {annetKontonummerBarnepensjon === IValg.NEI && (
                                                    <SkjemaElement>
                                                        <RHFKontonummerInput
                                                            name={'barnepensjon.kontonummer.kontonummer'}
                                                            htmlSize={Bredde.S}
                                                            label={t('omBarn.barnepensjon.kontonummer.kontonummer')}
                                                            placeholder={t(
                                                                'omBarn.barnepensjon.kontonummer.placeholder'
                                                            )}
                                                            description={t(
                                                                'omBarn.barnepensjon.kontonummer.informasjon'
                                                            )}
                                                        />
                                                    </SkjemaElement>
                                                )}
                                            </SkjemaGruppe>

                                            {annetKontonummerBarnepensjon !== IValg.VET_IKKE && (
                                                <RHFSpoersmaalRadio
                                                    name={'barnepensjon.forskuddstrekk.svar'}
                                                    legend={
                                                        <HelpTextLabel>
                                                            {t('omBarn.barnepensjon.forskuddstrekk.svar')}&nbsp;
                                                            <HelpText>
                                                                {t('omBarn.barnepensjon.forskuddstrekk.hjelpetekst')}
                                                            </HelpText>
                                                        </HelpTextLabel>
                                                    }
                                                />
                                            )}

                                            {forskuddstrekkBarnepensjon === IValg.JA && (
                                                <SkjemaGruppe>
                                                    <SkjemaElement>
                                                        <RHFProsentInput
                                                            htmlSize={Bredde.S}
                                                            name={'barnepensjon.forskuddstrekk.trekkprosent'}
                                                            label={t('omBarn.barnepensjon.forskuddstrekk.trekkprosent')}
                                                            placeholder={t(
                                                                'omBarn.barnepensjon.forskuddstrekk.placeholder'
                                                            )}
                                                        />
                                                    </SkjemaElement>
                                                    <Panel border>
                                                        <Alert variant={'info'} className={'navds-alert--inline'}>
                                                            <BodyShort size={'small'}>
                                                                {t('omBarn.barnepensjon.forskuddstrekk.info')}
                                                            </BodyShort>
                                                        </Alert>
                                                    </Panel>
                                                </SkjemaGruppe>
                                            )}
                                        </>
                                    )}
                                </SkjemaGruppe>
                            </>
                        )}

                        {(relasjon === BarnRelasjon.egneSaerkullsbarn ||
                            relasjon == BarnRelasjon.avdoedesSaerkullsbarn) && (
                            <SkjemaGruppe>
                                <RHFSpoersmaalRadio name={'dagligOmsorg'} legend={t('omBarn.dagligOmsorg')} />
                            </SkjemaGruppe>
                        )}

                        <Feilmeldinger errors={errors} />

                        <NavigasjonsRad className={'bottom-spacing-none'}>
                            <Button
                                id={'avbrytLeggTilBarn'}
                                variant={'secondary'}
                                type={'button'}
                                onClick={avbrytOgLukk}
                                style={{ minWidth: '80px' }}
                            >
                                {t('knapp.avbryt')}
                            </Button>

                            <Button
                                id={'leggTilBarn'}
                                variant={'primary'}
                                type={'button'}
                                onClick={handleSubmit(leggTilOgLukk)}
                                style={{ minWidth: '80px' }}
                            >
                                {t('knapp.lagre')}
                            </Button>
                        </NavigasjonsRad>
                    </EndreBarnKortInnhold>
                </EndreBarnKort>
            </form>
        </FormProvider>
    )
}

export default LeggTilBarnSkjema
