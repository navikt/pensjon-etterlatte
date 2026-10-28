import { HStack, InfoCard, Provider, Radio, RadioGroup, TextField, VStack } from '@navikt/ds-react'
import { en, nb, nn } from '@navikt/ds-react/locales'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useOutletContext } from 'react-router'
import { useSoknadContext } from '~context/soknad/SoknadContext'
import { Omfang, UtdanningOgTiltakKladd } from '~typer/skjema'
import { gyldigStudieprosent, rensUtdanningOgTiltak } from '~utils/utdanningOgTiltak'
import Datovelger from '../../felles/Datovelger'
import { SoeknadSteg, SoeknadStegContext } from '../SoeknadSteg'

const OmfangRadio = ({ utdanning }: { utdanning: boolean }) => {
    const { t } = useTranslation()
    const { control, getValues, reset } = useFormContext<UtdanningOgTiltakKladd>()
    const name = utdanning ? 'utdanning.studieform' : 'arbeidsrettetTiltak.omfang'
    return (
        <Controller
            name={name}
            control={control}
            rules={{ required: t(utdanning ? 'utdanningOgTiltak.feil.studieform' : 'utdanningOgTiltak.feil.omfang') }}
            render={({ field, fieldState }) => (
                <RadioGroup
                    legend={t(utdanning ? 'kontrakt.studieform' : 'kontrakt.omfang')}
                    name={field.name}
                    value={field.value ?? ''}
                    onBlur={field.onBlur}
                    onChange={(verdi) => {
                        field.onChange(verdi)
                        reset(rensUtdanningOgTiltak(getValues()))
                    }}
                    error={fieldState.error?.message}
                >
                    <Radio id={name} ref={field.ref} value="HELTID">
                        {t('kontrakt.HELTID')}
                    </Radio>
                    <Radio value="DELTID">{t('kontrakt.DELTID')}</Radio>
                </RadioGroup>
            )}
        />
    )
}

const hentAdvarsel = (
    aktivitet: UtdanningOgTiltakKladd['aktivitet'],
    studieform: Omfang | undefined,
    studieprosent: string | undefined
) => {
    if (aktivitet === 'INGEN') return 'utdanningOgTiltak.advarsel.ingen'
    if (
        aktivitet === 'UTDANNING' &&
        studieform === 'DELTID' &&
        gyldigStudieprosent(studieprosent) &&
        Number(studieprosent) < 50
    )
        return 'utdanningOgTiltak.advarsel.studieprosent'

    return undefined
}

export const UtdanningOgTiltak = () => {
    const { t, i18n } = useTranslation()
    const {
        control,
        register,
        getValues,
        reset,
        formState: { errors },
    } = useFormContext<UtdanningOgTiltakKladd>()
    const aktivitet = useWatch({ control, name: 'aktivitet' })
    const studieform = useWatch({ control, name: 'utdanning.studieform' })
    const studieprosent = useWatch({ control, name: 'utdanning.studieprosent' })
    const advarsel = hentAdvarsel(aktivitet, studieform, studieprosent)

    return (
        <>
            <Controller
                name="aktivitet"
                control={control}
                rules={{ required: t('utdanningOgTiltak.feil.aktivitet') }}
                render={({ field, fieldState }) => (
                    <RadioGroup
                        legend={t('kontrakt.aktivitet')}
                        name={field.name}
                        value={field.value ?? ''}
                        onBlur={field.onBlur}
                        onChange={(verdi) => reset(rensUtdanningOgTiltak({ ...getValues(), aktivitet: verdi }))}
                        error={fieldState.error?.message}
                    >
                        <Radio id="aktivitet" ref={field.ref} value="UTDANNING">
                            {t('kontrakt.UTDANNING')}
                        </Radio>
                        <Radio value="ARBEIDSRETTET_TILTAK" description={t('utdanningOgTiltak.tiltakBeskrivelse')}>
                            {t('kontrakt.ARBEIDSRETTET_TILTAK')}
                        </Radio>
                        <Radio value="INGEN">{t('kontrakt.INGEN')}</Radio>
                    </RadioGroup>
                )}
            />
            {aktivitet === 'UTDANNING' && (
                <>
                    <VStack gap="space-16" align="start">
                        {(['studiested', 'studie'] as const).map((felt) => (
                            <TextField
                                key={felt}
                                id={`utdanning.${felt}`}
                                label={t(`kontrakt.${felt}`)}
                                htmlSize={30}
                                error={errors.utdanning?.[felt]?.message}
                                {...register(`utdanning.${felt}`, {
                                    setValueAs: (verdi: string) => verdi.trim(),
                                    validate: (verdi) => !!verdi?.trim() || t(`utdanningOgTiltak.feil.${felt}`),
                                    maxLength: { value: 200, message: t('utdanningOgTiltak.feil.maksLengde') },
                                })}
                            />
                        ))}
                        <Provider locale={i18n.language === 'en' ? en : i18n.language === 'nn' ? nn : nb}>
                            <HStack gap="space-16" align="start">
                                <Datovelger name="utdanning.startDato" label={t('kontrakt.startDato')} />
                                <Datovelger name="utdanning.sluttDato" label={t('kontrakt.sluttDato')} />
                            </HStack>
                        </Provider>
                    </VStack>
                    <OmfangRadio utdanning />
                    {studieform === 'DELTID' && (
                        <VStack align="start">
                            <TextField
                                id="utdanning.studieprosent"
                                label={t('kontrakt.studieprosent')}
                                inputMode="numeric"
                                htmlSize={4}
                                error={errors.utdanning?.studieprosent?.message}
                                {...register('utdanning.studieprosent', {
                                    required: t('utdanningOgTiltak.feil.studieprosentPaakrevd'),
                                    validate: (verdi) =>
                                        gyldigStudieprosent(verdi) || t('utdanningOgTiltak.feil.studieprosent'),
                                })}
                            />
                        </VStack>
                    )}
                </>
            )}
            {aktivitet === 'ARBEIDSRETTET_TILTAK' && (
                <>
                    <VStack align="start">
                        <TextField
                            id="arbeidsrettetTiltak.tiltak"
                            label={t('kontrakt.tiltak')}
                            htmlSize={30}
                            error={errors.arbeidsrettetTiltak?.tiltak?.message}
                            {...register('arbeidsrettetTiltak.tiltak', {
                                setValueAs: (verdi: string) => verdi.trim(),
                                validate: (verdi) => !!verdi?.trim() || t('utdanningOgTiltak.feil.tiltak'),
                                maxLength: { value: 200, message: t('utdanningOgTiltak.feil.maksLengde') },
                            })}
                        />
                    </VStack>
                    <OmfangRadio utdanning={false} />
                    <Controller
                        name="aktivitetsplan"
                        control={control}
                        rules={{ required: t('utdanningOgTiltak.feil.aktivitetsplan') }}
                        render={({ field, fieldState }) => (
                            <RadioGroup
                                legend={t('kontrakt.aktivitetsplan')}
                                name={field.name}
                                value={field.value ?? ''}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                error={fieldState.error?.message}
                            >
                                <Radio id="aktivitetsplan" ref={field.ref} value="JA">
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
                        <InfoCard.Title as="h3">{t('utdanningOgTiltak.advarsel.tittel')}</InfoCard.Title>
                    </InfoCard.Header>
                    <InfoCard.Content>{t(advarsel)}</InfoCard.Content>
                </InfoCard>
            )}
        </>
    )
}

export const UtdanningOgTiltakSteg = () => {
    const { t } = useTranslation()
    const { state } = useSoknadContext()
    const { path, tittel, neste, forrige } = useOutletContext<SoeknadStegContext>()
    const kladd = rensUtdanningOgTiltak(state.skjema.utdanningOgTiltak ?? {})
    return (
        <SoeknadSteg<UtdanningOgTiltakKladd>
            key={path}
            tittel={tittel}
            defaultValues={kladd}
            valider={(data) => {
                const fra = data.utdanning?.startDato
                const til = data.utdanning?.sluttDato
                return data.aktivitet === 'UTDANNING' && fra && til && fra > til
                    ? [{ name: 'utdanning.sluttDato', message: t('utdanningOgTiltak.feil.periode') }]
                    : []
            }}
            oppdaterSoeknad={(soeknad, data) => ({
                ...soeknad,
                aktivtSteg: path,
                skjema: { ...soeknad.skjema, utdanningOgTiltak: rensUtdanningOgTiltak(data) },
            })}
            neste={neste}
            forrige={forrige}
        >
            <UtdanningOgTiltak />
        </SoeknadSteg>
    )
}
