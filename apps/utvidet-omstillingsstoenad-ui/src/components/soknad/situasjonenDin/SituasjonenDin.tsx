import { InfoCard, Radio, RadioGroup, TextField, VStack } from '@navikt/ds-react'
import { fnr } from '@navikt/fnrvalidator'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useBrukerContext } from '~context/bruker/BrukerContext'
import { useSoknadContext } from '~context/soknad/SoknadContext'
import { SituasjonenDinKladd } from '~typer/skjema'
import { SoeknadSteg } from '../SoeknadSteg'

export const rensSituasjonenDin = (data: SituasjonenDinKladd): SituasjonenDinKladd => {
    const { nySivilstand, samboer } = data
    return {
        ...(nySivilstand ? { nySivilstand } : {}),
        ...(nySivilstand === 'NY_SAMBOER' && samboer
            ? {
                  samboer: {
                      ...samboer,
                      ...(samboer.fornavn !== undefined ? { fornavn: samboer.fornavn.trim() } : {}),
                      ...(samboer.etternavn !== undefined ? { etternavn: samboer.etternavn.trim() } : {}),
                      ...(samboer.foedselsnummer !== undefined
                          ? { foedselsnummer: samboer.foedselsnummer.replace(/\s/g, '') }
                          : {}),
                  },
              }
            : {}),
    }
}

const SituasjonenDinFelt = () => {
    const { t } = useTranslation()
    const { state: bruker } = useBrukerContext()
    const {
        control,
        register,
        getValues,
        reset,
        formState: { errors },
    } = useFormContext<SituasjonenDinKladd>()
    const nySivilstand = useWatch({ control, name: 'nySivilstand' })
    const fellesBarn = useWatch({ control, name: 'samboer.fellesBarnEllertidligereGift' })
    const advarsel =
        nySivilstand === 'GIFTET_PAA_NYTT'
            ? 'situasjonenDin.advarsel.gift'
            : nySivilstand === 'NY_SAMBOER' && fellesBarn === 'JA'
              ? 'situasjonenDin.advarsel.samboer'
              : undefined

    return (
        <>
            <Controller
                name="nySivilstand"
                control={control}
                rules={{ required: t('situasjonenDin.feil.nySivilstand') }}
                render={({ field, fieldState }) => (
                    <RadioGroup
                        legend={t('kontrakt.nySivilstand')}
                        name={field.name}
                        value={field.value ?? ''}
                        onBlur={field.onBlur}
                        onChange={(verdi) => {
                            reset({
                                ...getValues(),
                                nySivilstand: verdi,
                                ...(verdi === 'NY_SAMBOER' ? {} : { samboer: undefined }),
                            })
                        }}
                        error={fieldState.error?.message}
                    >
                        <Radio id="nySivilstand" ref={field.ref} value="NY_SAMBOER">
                            {t('kontrakt.NY_SAMBOER')}
                        </Radio>
                        <Radio value="GIFTET_PAA_NYTT">{t('kontrakt.GIFTET_PAA_NYTT')}</Radio>
                        <Radio value="INGEN_AV_DELENE">{t('kontrakt.INGEN_AV_DELENE')}</Radio>
                    </RadioGroup>
                )}
            />
            {nySivilstand === 'NY_SAMBOER' && (
                <>
                    <VStack gap="space-16" align="start">
                        <TextField
                            id="samboer.fornavn"
                            label={t('kontrakt.samboerFornavn')}
                            autoComplete="off"
                            htmlSize={25}
                            error={errors.samboer?.fornavn?.message}
                            {...register('samboer.fornavn', {
                                validate: (verdi) => !!verdi?.trim() || t('situasjonenDin.feil.fornavn'),
                            })}
                        />
                        <TextField
                            id="samboer.etternavn"
                            label={t('kontrakt.samboerEtternavn')}
                            autoComplete="off"
                            htmlSize={25}
                            error={errors.samboer?.etternavn?.message}
                            {...register('samboer.etternavn', {
                                validate: (verdi) => !!verdi?.trim() || t('situasjonenDin.feil.etternavn'),
                            })}
                        />
                        <TextField
                            id="samboer.foedselsnummer"
                            label={t('kontrakt.samboerFoedselsnummer')}
                            autoComplete="off"
                            inputMode="numeric"
                            htmlSize={25}
                            error={errors.samboer?.foedselsnummer?.message}
                            {...register('samboer.foedselsnummer', {
                                setValueAs: (verdi: string) => verdi.replace(/\s/g, ''),
                                required: t('situasjonenDin.feil.foedselsnummerPaakrevd'),
                                validate: {
                                    gyldig: (verdi) =>
                                        (!!verdi && fnr(verdi).status === 'valid') ||
                                        t('situasjonenDin.feil.foedselsnummerUgyldig'),
                                    ikkeEget: (verdi) =>
                                        verdi !== bruker.foedselsnummer || t('situasjonenDin.feil.foedselsnummerEget'),
                                },
                            })}
                        />
                    </VStack>
                    <Controller
                        name="samboer.fellesBarnEllertidligereGift"
                        control={control}
                        rules={{ required: t('situasjonenDin.feil.fellesBarn') }}
                        render={({ field, fieldState }) => (
                            <RadioGroup
                                legend={t('kontrakt.fellesBarnEllertidligereGift')}
                                name={field.name}
                                value={field.value ?? ''}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                error={fieldState.error?.message}
                            >
                                <Radio id="samboer.fellesBarnEllertidligereGift" ref={field.ref} value="JA">
                                    {t('kontrakt.JA')}
                                </Radio>
                                <Radio value="NEI">{t('kontrakt.NEI')}</Radio>
                            </RadioGroup>
                        )}
                    />
                </>
            )}
            {advarsel && (
                <InfoCard data-color="warning">
                    <InfoCard.Header>
                        <InfoCard.Title as="h3">{t('situasjonenDin.advarsel.tittel')}</InfoCard.Title>
                    </InfoCard.Header>
                    <InfoCard.Content>{t(advarsel)}</InfoCard.Content>
                </InfoCard>
            )}
        </>
    )
}

export const SituasjonenDinSteg = () => {
    const { state } = useSoknadContext()
    const { t } = useTranslation()
    return (
        <SoeknadSteg<SituasjonenDinKladd>
            tittel={t('skjema.situasjonenDin')}
            defaultValues={rensSituasjonenDin(state.skjema.situasjonenDinIDag ?? {})}
            oppdaterSoeknad={(soeknad, data) => ({
                ...soeknad,
                aktivtSteg: 'situasjonen-din',
                skjema: { ...soeknad.skjema, situasjonenDinIDag: rensSituasjonenDin(data) },
            })}
            neste="utdanning-og-tiltak"
            forrige="personopplysninger"
        >
            <SituasjonenDinFelt />
        </SoeknadSteg>
    )
}
