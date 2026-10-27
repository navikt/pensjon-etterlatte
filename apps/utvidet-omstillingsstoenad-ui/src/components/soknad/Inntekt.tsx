import { BodyLong, Radio, RadioGroup, Select, Textarea, TextField, VStack } from '@navikt/ds-react'
import { useEffect } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Inntekt as InntektSkjema, Inntektsendring } from '../../typer/skjema'
import { erGyldigBeloep } from '../../utils/inntekt'
import styles from './Inntekt.module.css'
import {
    ArbeidsinntekterDuSkalFylleUtReadMore,
    InntekterFraUtlandDuSkalFylleUt,
    NaeringsinntekterDuSkalFylleUtReadMore,
} from './InntektReadMore'

const grunner: Inntektsendring[] = [
    'OEKT_STILLINGSPROSENT',
    'REDUSERT_STILLINGSPROSENT',
    'PERMISJON_UTEN_LOENN',
    'LOENNSOEKNING',
    'ARBEIDSLEDIG',
    'SESONGARBEID',
    'BYTTE_AV_JOBB',
    'ANNEN_GRUNN',
]

const RHFInntektInput = ({
    name,
    label,
    description,
    className = styles.beloep,
}: {
    name: 'arbeidsinntekt' | 'naeringsinntekt' | 'inntektFraUtland' | 'andreInntekter.inntekt'
    label: string
    description?: string
    className?: string
}) => {
    const { t, i18n } = useTranslation()
    const { control } = useFormContext<InntektSkjema>()
    return (
        <Controller
            name={name}
            control={control}
            rules={{
                required: t('inntekt.feil.paakrevdBeloep', { felt: label.toLocaleLowerCase(i18n.language) }),
                validate: (verdi) => (!!verdi && erGyldigBeloep(verdi)) || t('inntekt.feil.beloep'),
            }}
            render={({ field, fieldState }) => (
                <TextField
                    {...field}
                    className={className}
                    id={name}
                    value={field.value ?? ''}
                    label={label}
                    description={description}
                    error={fieldState.error?.message}
                    inputMode="numeric"
                />
            )}
        />
    )
}

const RHFInntektsvalg = ({
    name,
    legend,
    feilmelding,
}: {
    name: 'andreInntekter.valg' | 'noeSomKanPaavirkeInntekten.valg'
    legend: string
    feilmelding: string
}) => {
    const { t } = useTranslation()
    const { control } = useFormContext<InntektSkjema>()
    return (
        <Controller
            name={name}
            control={control}
            rules={{ required: feilmelding }}
            render={({ field, fieldState }) => (
                <RadioGroup {...field} value={field.value ?? ''} legend={legend} error={fieldState.error?.message}>
                    {(['JA', 'NEI', 'VET_IKKE'] as const).map((valg, index) => (
                        <Radio key={valg} value={valg} id={index === 0 ? name : `${name}-${valg}`}>
                            {t(`kontrakt.${valg}`)}
                        </Radio>
                    ))}
                </RadioGroup>
            )}
        />
    )
}

const RHFBeskrivelse = ({
    name,
    label,
    feilmelding,
}: {
    name: 'andreInntekter.beskrivelse' | 'noeSomKanPaavirkeInntekten.beskrivelse'
    label: string
    feilmelding: string
}) => {
    const { t } = useTranslation()
    const { control } = useFormContext<InntektSkjema>()
    return (
        <Controller
            name={name}
            control={control}
            rules={{
                validate: (verdi) => !!verdi?.trim() || feilmelding,
                maxLength: { value: 1000, message: t('inntekt.feil.maksLengde') },
            }}
            render={({ field, fieldState }) => (
                <Textarea
                    {...field}
                    className={styles.beskrivelse}
                    id={name}
                    value={field.value ?? ''}
                    label={label}
                    error={fieldState.error?.message}
                    maxLength={1000}
                    minRows={3}
                    resize="vertical"
                    autoComplete="off"
                    i18n={{
                        counterLeft: t('inntekt.counterLeft'),
                        counterTooMuch: t('inntekt.counterTooMuch'),
                    }}
                />
            )}
        />
    )
}

const Inntekt = () => {
    const { t } = useTranslation()
    const { control, unregister } = useFormContext<InntektSkjema>()
    const andreInntekter = useWatch({ control, name: 'andreInntekter.valg' })
    const paavirkeInntekt = useWatch({ control, name: 'noeSomKanPaavirkeInntekten.valg' })
    const grunn = useWatch({ control, name: 'noeSomKanPaavirkeInntekten.grunnTilPaavirkelseAvInntekt' })

    // Eksplisitt unregister fjerner også kladdens standardverdier, så gamle svar ikke kommer tilbake.
    useEffect(() => {
        if (andreInntekter !== 'JA') unregister(['andreInntekter.inntekt', 'andreInntekter.beskrivelse'])
    }, [andreInntekter, unregister])

    useEffect(() => {
        if (paavirkeInntekt !== 'JA') {
            unregister([
                'noeSomKanPaavirkeInntekten.grunnTilPaavirkelseAvInntekt',
                'noeSomKanPaavirkeInntekten.beskrivelse',
            ])
        } else if (grunn !== 'ANNEN_GRUNN') {
            unregister('noeSomKanPaavirkeInntekten.beskrivelse')
        }
    }, [paavirkeInntekt, grunn, unregister])

    return (
        <VStack gap="space-48">
            <BodyLong>{t('inntekt.ingress')}</BodyLong>
            <VStack gap="space-32">
                <VStack gap="space-12">
                    <VStack gap="space-8">
                        <RHFInntektInput name="arbeidsinntekt" label={t('kontrakt.arbeidsinntekt')} />
                        <ArbeidsinntekterDuSkalFylleUtReadMore />
                    </VStack>
                    <VStack gap="space-8">
                        <RHFInntektInput name="naeringsinntekt" label={t('kontrakt.naeringsinntekt')} />
                        <NaeringsinntekterDuSkalFylleUtReadMore />
                    </VStack>
                    <VStack gap="space-8">
                        <RHFInntektInput
                            name="inntektFraUtland"
                            className={styles.beloepUtland}
                            label={t('kontrakt.inntektFraUtland')}
                            description={t('inntekt.utlandBeskrivelse')}
                        />
                        <InntekterFraUtlandDuSkalFylleUt />
                    </VStack>
                </VStack>
                <VStack gap="space-20">
                    <RHFInntektsvalg
                        name="andreInntekter.valg"
                        legend={t('kontrakt.andreInntekter')}
                        feilmelding={t('inntekt.feil.andreInntekter')}
                    />
                    {andreInntekter === 'JA' && (
                        <>
                            <RHFInntektInput name="andreInntekter.inntekt" label={t('kontrakt.sumAndreInntekter')} />
                            <RHFBeskrivelse
                                name="andreInntekter.beskrivelse"
                                label={t('kontrakt.andreInntekterBeskrivelse')}
                                feilmelding={t('inntekt.feil.andreBeskrivelse')}
                            />
                        </>
                    )}
                </VStack>
                <VStack gap="space-48">
                    <RHFInntektsvalg
                        name="noeSomKanPaavirkeInntekten.valg"
                        legend={t('kontrakt.paavirkeInntekt')}
                        feilmelding={t('inntekt.feil.paavirkeInntekt')}
                    />
                    {paavirkeInntekt === 'JA' && (
                        <VStack gap="space-20">
                            <Controller
                                name="noeSomKanPaavirkeInntekten.grunnTilPaavirkelseAvInntekt"
                                control={control}
                                rules={{ required: t('inntekt.feil.grunn') }}
                                render={({ field, fieldState }) => (
                                    <Select
                                        {...field}
                                        className={styles.endringsgrunn}
                                        id={field.name}
                                        value={field.value ?? ''}
                                        label={t('kontrakt.grunnTilPaavirkelseAvInntekt')}
                                        error={fieldState.error?.message}
                                    >
                                        <option value="">{t('inntekt.velg')}</option>
                                        {grunner.map((verdi) => (
                                            <option key={verdi} value={verdi}>
                                                {t(`kontrakt.${verdi}`)}
                                            </option>
                                        ))}
                                    </Select>
                                )}
                            />
                            {grunn === 'ANNEN_GRUNN' && (
                                <RHFBeskrivelse
                                    name="noeSomKanPaavirkeInntekten.beskrivelse"
                                    label={t('kontrakt.endringBeskrivelse')}
                                    feilmelding={t('inntekt.feil.endringBeskrivelse')}
                                />
                            )}
                        </VStack>
                    )}
                </VStack>
            </VStack>
        </VStack>
    )
}

export default Inntekt
