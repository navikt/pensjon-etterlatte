import { SkjemaGruppe } from '../../felles/SkjemaGruppe'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BarnRelasjon, IBarn } from '../../../typer/person'
import { RHFRadio, RHFSpoersmaalRadio } from '../../felles/rhf/RHFRadio'
import { RHFFoedselsnummerInput, RHFInput, RHFKontonummerInput } from '../../felles/rhf/RHFInput'
import { IValg } from '../../../typer/Spoersmaal'
import Feilmeldinger from '../../felles/Feilmeldinger'
import { hentAlder, hentAlderFraFoedselsnummer } from '../../../utils/dato'
import { erMyndig } from '../../../utils/alder'
import { fnr } from '@navikt/fnrvalidator'
import { Alert, BodyShort, Box, Button, GuidePanel, Heading, HGrid, Label, RadioProps, VStack } from '@navikt/ds-react'
import { RHFCheckboks, RHFConfirmationPanel } from '../../felles/rhf/RHFCheckboksPanelGruppe'
import useCountries, { Options } from '../../../hooks/useCountries'
import ikon from '../../../assets/ikoner/barn1.svg'
import React, { useEffect } from 'react'
import { useBrukerContext } from '../../../context/bruker/BrukerContext'
import styled from 'styled-components'
import { NavigasjonsRad } from '../../felles/StyledComponents'
import { SkjemaElement } from '../../felles/SkjemaElement'
import Bredde from '../../../typer/bredde'
import { isDev } from '../../../api/axios'
import { Panel } from '../../felles/Panel'
import { BankkontoType } from '~typer/utbetaling'
import UtenlandskBankInfo from '../1-omdeg/utenlandskBankInfo/UtenlandskBankInfo'
import Datovelger from '~components/felles/Datovelger'
import { RHFCombobox } from '~components/felles/rhf/RHFCombobox'
import { LogEvents, useAmplitude } from '~hooks/useAmplitude'
import { FieldErrors } from 'react-hook-form/dist/types/errors'

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
    avbryt: (fjernAktivtBarn?: boolean) => void
    lagre: (data: IBarn) => void
    barn: IBarn
    fnrRegistrerteBarn: string[]
}

const LeggTilBarnSkjema = ({ avbryt, lagre, barn, fnrRegistrerteBarn }: Props) => {
    const { t } = useTranslation()
    const { countries }: { countries: Options[] } = useCountries()
    const { state: bruker } = useBrukerContext()
    const { logEvent } = useAmplitude()

    const endrerBarn = !!barn?.fornavn?.length

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

    const logErrors = (data: FieldErrors<IBarn>) => {
        Object.keys(data).map((error) =>
            logEvent(LogEvents.VALIDATION_ERROR, { skjemanavn: 'LeggTilBarnSkjema', id: error })
        )
    }

    const avbrytOgLukk = () => {
        if (barn.foedselsnummer === undefined && barn.foedselsdato === undefined) {
            avbryt(true)
        }
        avbryt()
        window.scrollTo(0, 0)
    }

    const bosattUtlandSvar = watch('bosattUtland.svar')
    const harBarnetVerge = watch('harBarnetVerge.svar')
    const relasjon = watch('relasjon')
    const foedselsnummer: any = watch('foedselsnummer')
    const foedselsdato: any = watch('foedselsdato')
    const ukjentFoedselsnummer: any = watch('ukjentFoedselsnummer')
    const annetKontonummerBarnepensjon = watch('barnepensjon.kontonummer.svar')
    const bankkontoType = watch('barnepensjon.utbetalingsInformasjon.bankkontoType')

    const kanSoekeOmBarnepensjon = (): boolean => {
        if (foedselsnummer && fnr(foedselsnummer).status === 'valid') {
            const alder = hentAlderFraFoedselsnummer(foedselsnummer)
            return !erMyndig(alder)
        } else if (foedselsdato) {
            const alder = hentAlder(new Date(foedselsdato))
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
        <>
            <SkjemaElement>
                <GuidePanel>
                    <Heading size={'small'}>{t('omBarn.informasjon.tittel')}</Heading>
                    <BodyShort>{t('omBarn.informasjon')}</BodyShort>
                </GuidePanel>
            </SkjemaElement>
            <FormProvider {...methods}>
                <form onSubmit={(e) => e.preventDefault()} autoComplete={isDev ? 'on' : 'off'}>
                    <EndreBarnKort border padding={'0'}>
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
                                    <HGrid gap={'4'} columns={{ xs: 1, sm: 2 }} align={'start'}>
                                        <RHFInput
                                            name={'fornavn'}
                                            label={t('omBarn.fornavn')}
                                            rules={{ pattern: /^\D+$/ }}
                                        />

                                        <RHFInput
                                            name={'etternavn'}
                                            label={t('omBarn.etternavn')}
                                            rules={{ pattern: /^\D+$/ }}
                                        />
                                    </HGrid>
                                </SkjemaElement>
                                <SkjemaElement>
                                    {!ukjentFoedselsnummer && (
                                        <RHFFoedselsnummerInput
                                            name={'foedselsnummer'}
                                            label={t('omBarn.foedselsnummer')}
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
                                            htmlSize={Bredde.S}
                                        />
                                    )}

                                    <RHFCheckboks
                                        name={'ukjentFoedselsnummer'}
                                        label={t('omBarn.ukjentFoedselsnummer')}
                                    />

                                    {ukjentFoedselsnummer && (
                                        <VStack gap="4">
                                            <Alert variant={'info'}>{t('omBarn.ukjentFoedselsnummerInfo')}</Alert>
                                            <Datovelger name={'foedselsdato'} label={t('omBarn.foedselsdato')} />
                                        </VStack>
                                    )}
                                </SkjemaElement>
                                <Box maxWidth="14rem">
                                    <SkjemaElement>
                                        <RHFCombobox
                                            name={`statsborgerskap`}
                                            label={t('omBarn.statsborgerskap')}
                                            options={countries}
                                        />
                                    </SkjemaElement>
                                </Box>

                                {visDuplikatFeilmelding() && (
                                    <SkjemaElement>
                                        <TypoFeilmelding>{t('feil.foedselsnummer.duplicate')}</TypoFeilmelding>
                                    </SkjemaElement>
                                )}
                            </SkjemaGruppe>

                            <SkjemaGruppe>
                                <RHFSpoersmaalRadio name={'bosattUtland.svar'} legend={t('omBarn.bosattUtland.svar')} />

                                {bosattUtlandSvar === IValg.JA && (
                                    <>
                                        <Box maxWidth="14rem">
                                            <SkjemaElement>
                                                <RHFCombobox
                                                    name={'bosattUtland.land'}
                                                    label={t('omBarn.bosattUtland.land')}
                                                    options={countries}
                                                />
                                            </SkjemaElement>
                                        </Box>
                                        <RHFInput
                                            name={'bosattUtland.adresse'}
                                            label={t('omBarn.bosattUtland.adresse')}
                                        />
                                    </>
                                )}
                            </SkjemaGruppe>

                            {kanSoekeOmBarnepensjon() && (
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
                                                    <HGrid gap={'4'} columns={{ xs: 1, sm: 2 }} align={'start'}>
                                                        <RHFInput
                                                            name={'harBarnetVerge.fornavn'}
                                                            label={t('omBarn.harBarnetVerge.fornavn')}
                                                            rules={{ pattern: /^\D+$/ }}
                                                            valgfri={true}
                                                        />
                                                        <RHFInput
                                                            name={'harBarnetVerge.etternavn'}
                                                            label={t('omBarn.harBarnetVerge.etternavn')}
                                                            rules={{ pattern: /^\D+$/ }}
                                                            valgfri={true}
                                                        />
                                                        <RHFFoedselsnummerInput
                                                            name={'harBarnetVerge.foedselsnummer'}
                                                            label={t('omBarn.harBarnetVerge.foedselsnummer')}
                                                            description={t(
                                                                'omBarn.harBarnetVerge.foedselsnummerPlaceholder'
                                                            )}
                                                            valgfri={true}
                                                        />
                                                    </HGrid>
                                                </SkjemaElement>
                                            </>
                                        )}
                                    </SkjemaGruppe>
                                    {!bruker.adressebeskyttelse && (
                                        <>
                                            <SkjemaElement>
                                                <RHFSpoersmaalRadio
                                                    name={'barnepensjon.kontonummer.svar'}
                                                    legend={t('omBarn.barnepensjon.kontonummer.svar')}
                                                    description={t('omBarn.barnepensjon.kontonummer.informasjon')}
                                                />
                                            </SkjemaElement>

                                            {annetKontonummerBarnepensjon === IValg.NEI && (
                                                <SkjemaElement>
                                                    <SkjemaGruppe>
                                                        <SkjemaElement>
                                                            <RHFRadio
                                                                name={
                                                                    'barnepensjon.utbetalingsInformasjon.bankkontoType'
                                                                }
                                                                legend={t('omDeg.utbetalingsInformasjon.bankkontoType')}
                                                            >
                                                                {Object.values(BankkontoType).map((value) => {
                                                                    return {
                                                                        children: t(value),
                                                                        value,
                                                                    } as RadioProps
                                                                })}
                                                            </RHFRadio>
                                                        </SkjemaElement>

                                                        {bankkontoType === BankkontoType.norsk && (
                                                            <RHFKontonummerInput
                                                                htmlSize={Bredde.S}
                                                                name={'barnepensjon.utbetalingsInformasjon.kontonummer'}
                                                                label={t('omDeg.utbetalingsInformasjon.kontonummer')}
                                                                description={t(
                                                                    'omDeg.utbetalingsInformasjon.informasjon'
                                                                )}
                                                            />
                                                        )}

                                                        {bankkontoType === BankkontoType.utenlandsk && (
                                                            <UtenlandskBankInfo kontonummerTilhoererBarn />
                                                        )}
                                                    </SkjemaGruppe>
                                                </SkjemaElement>
                                            )}
                                        </>
                                    )}

                                    <SkjemaGruppe>
                                        <SkjemaElement>
                                            <RHFConfirmationPanel
                                                name={'barnepensjon.soeker'}
                                                label={t('omBarn.barnepensjon.soeker')}
                                                valgfri={true}
                                                size={'medium'}
                                            />
                                        </SkjemaElement>
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
                                    onClick={handleSubmit(leggTilOgLukk, logErrors)}
                                    style={{ minWidth: '80px' }}
                                >
                                    {endrerBarn ? t('knapp.lagreEndring') : t('knapp.leggTil')}
                                </Button>
                            </NavigasjonsRad>
                        </EndreBarnKortInnhold>
                    </EndreBarnKort>
                </form>
            </FormProvider>
        </>
    )
}

export default LeggTilBarnSkjema
