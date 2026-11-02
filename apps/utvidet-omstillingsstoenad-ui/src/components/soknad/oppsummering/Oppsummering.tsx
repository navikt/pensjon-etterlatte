import { BodyLong, GuidePanel, Link, VStack } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import { useBrukerContext } from '../../../context/bruker/BrukerContext'
import { useSoknadContext } from '../../../context/soknad/SoknadContext'
import { fullAdresse } from '../../../utils/adresse'
import { OppsummeringSeksjon } from './OppsummeringSeksjon'
import { OppsummeringSvar } from './OppsummeringSvar'

const visningsdato = (dato: string, locale: string) => {
    const ymd = dato.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (ymd) return `${ymd[3]}.${ymd[2]}.${ymd[1]}`

    const parsed = new Date(dato)
    if (Number.isNaN(parsed.getTime())) return dato

    return new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'Europe/Oslo',
    }).format(parsed)
}

const visningsbeloep = (beloep: string, locale: string) => {
    const normalisert = beloep.replace(/\s/g, '')
    if (!/^\d+$/.test(normalisert)) return beloep
    return new Intl.NumberFormat(locale).format(Number(normalisert))
}

export const Oppsummering = () => {
    const { t, i18n } = useTranslation()
    const { state: bruker } = useBrukerContext()
    const { state: soeknad } = useSoknadContext()
    const locale = i18n.language === 'en' ? 'en-GB' : i18n.language === 'nn' ? 'nn-NO' : 'nb-NO'
    const situasjonenDin = soeknad.skjema.situasjonenDinIDag
    const utdanningOgTiltak = soeknad.skjema.utdanningOgTiltak
    const inntekt = soeknad.skjema.inntekt
    const periode =
        utdanningOgTiltak?.utdanning?.startDato && utdanningOgTiltak?.utdanning?.sluttDato
            ? `${t('kontrakt.startDato')}: ${visningsdato(utdanningOgTiltak.utdanning.startDato, locale)} / ${t('kontrakt.sluttDato')}: ${visningsdato(utdanningOgTiltak.utdanning.sluttDato, locale)}`
            : undefined

    const opplysninger = [
        {
            label: t('personopplysninger.navn'),
            value: [bruker.fornavn, bruker.etternavn].filter((navn) => !!navn).join(' '),
        },
        { label: t('personopplysninger.foedselsnummer'), value: bruker.foedselsnummer },
        { label: t('personopplysninger.bostedsadresse'), value: fullAdresse(bruker) },
        {
            label: t('personopplysninger.sivilstatus'),
            value: bruker.sivilstatus
                ? t(`personopplysninger.sivilstatus.${bruker.sivilstatus}`, { defaultValue: bruker.sivilstatus })
                : undefined,
        },
        { label: t('personopplysninger.statsborgerskap'), value: bruker.statsborgerskap },
        { label: t('personopplysninger.telefonnummer'), value: bruker.telefonnummer },
    ]

    return (
        <VStack gap="space-32">
            <GuidePanel poster>
                <BodyLong>{t('oppsummering.veileder')}</BodyLong>
            </GuidePanel>

            <OppsummeringSeksjon
                tittel={t('skjema.personopplysninger')}
                footer={
                    <Link
                        href={t('personopplysninger.opplysningerFeil.href')}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t('personopplysninger.opplysningerFeil.lenke')}
                    </Link>
                }
            >
                {opplysninger
                    .filter(({ value }) => value !== undefined && value !== null && value !== '')
                    .map(({ label, value }) => (
                        <OppsummeringSvar key={label} spoersmaal={label} svar={value} />
                    ))}
            </OppsummeringSeksjon>

            <OppsummeringSeksjon tittel={t('skjema.situasjonenDin')} endrePath="situasjonen-din">
                <OppsummeringSvar
                    spoersmaal={t('kontrakt.nySivilstand')}
                    svar={situasjonenDin?.nySivilstand ? t(`kontrakt.${situasjonenDin.nySivilstand}`) : undefined}
                />
                <OppsummeringSvar spoersmaal={t('kontrakt.samboerFornavn')} svar={situasjonenDin?.samboer?.fornavn} />
                <OppsummeringSvar
                    spoersmaal={t('kontrakt.samboerEtternavn')}
                    svar={situasjonenDin?.samboer?.etternavn}
                />
                <OppsummeringSvar
                    spoersmaal={t('kontrakt.samboerFoedselsnummer')}
                    svar={situasjonenDin?.samboer?.foedselsnummer}
                />
                <OppsummeringSvar
                    spoersmaal={t('kontrakt.fellesBarnEllertidligereGift')}
                    svar={
                        situasjonenDin?.samboer?.fellesBarnEllertidligereGift
                            ? t(`kontrakt.${situasjonenDin.samboer.fellesBarnEllertidligereGift}`)
                            : undefined
                    }
                />
            </OppsummeringSeksjon>

            <OppsummeringSeksjon tittel={t('skjema.utdanningOgTiltak')} endrePath="utdanning-og-tiltak">
                <OppsummeringSvar
                    spoersmaal={t('kontrakt.aktivitet')}
                    svar={utdanningOgTiltak?.aktivitet ? t(`kontrakt.${utdanningOgTiltak.aktivitet}`) : undefined}
                />
                <OppsummeringSvar
                    spoersmaal={t('kontrakt.studiested')}
                    svar={utdanningOgTiltak?.utdanning?.studiested}
                />
                <OppsummeringSvar spoersmaal={t('kontrakt.studie')} svar={utdanningOgTiltak?.utdanning?.studie} />
                <OppsummeringSvar spoersmaal={t('oppsummering.periode')} svar={periode} />
                <OppsummeringSvar
                    spoersmaal={t('kontrakt.studieform')}
                    svar={
                        utdanningOgTiltak?.utdanning?.studieform
                            ? t(`kontrakt.${utdanningOgTiltak.utdanning.studieform}`)
                            : undefined
                    }
                />
                <OppsummeringSvar
                    spoersmaal={t('kontrakt.studieprosent')}
                    svar={
                        utdanningOgTiltak?.utdanning?.studieprosent
                            ? `${utdanningOgTiltak.utdanning.studieprosent} %`
                            : undefined
                    }
                />
                <OppsummeringSvar
                    spoersmaal={t('kontrakt.tiltak')}
                    svar={utdanningOgTiltak?.arbeidsrettetTiltak?.tiltak}
                />
                <OppsummeringSvar
                    spoersmaal={t('kontrakt.omfang')}
                    svar={
                        utdanningOgTiltak?.arbeidsrettetTiltak?.omfang
                            ? t(`kontrakt.${utdanningOgTiltak.arbeidsrettetTiltak.omfang}`)
                            : undefined
                    }
                />
                <OppsummeringSvar
                    spoersmaal={t('kontrakt.aktivitetsplan')}
                    svar={
                        utdanningOgTiltak?.aktivitetsplan
                            ? t(`kontrakt.${utdanningOgTiltak.aktivitetsplan}`)
                            : undefined
                    }
                />
            </OppsummeringSeksjon>

            <OppsummeringSeksjon tittel={t('skjema.inntekt')} endrePath="inntekt">
                <OppsummeringSvar
                    spoersmaal={t('kontrakt.arbeidsinntekt')}
                    svar={inntekt?.arbeidsinntekt ? visningsbeloep(inntekt.arbeidsinntekt, locale) : undefined}
                />
                <OppsummeringSvar
                    spoersmaal={t('kontrakt.naeringsinntekt')}
                    svar={inntekt?.naeringsinntekt ? visningsbeloep(inntekt.naeringsinntekt, locale) : undefined}
                />
                <OppsummeringSvar
                    spoersmaal={t('kontrakt.inntektFraUtland')}
                    svar={inntekt?.inntektFraUtland ? visningsbeloep(inntekt.inntektFraUtland, locale) : undefined}
                />
                <OppsummeringSvar
                    spoersmaal={t('kontrakt.andreInntekter')}
                    svar={inntekt?.andreInntekter?.valg ? t(`kontrakt.${inntekt.andreInntekter.valg}`) : undefined}
                />
                <OppsummeringSvar
                    spoersmaal={t('kontrakt.sumAndreInntekter')}
                    svar={
                        inntekt?.andreInntekter?.inntekt
                            ? visningsbeloep(inntekt.andreInntekter.inntekt, locale)
                            : undefined
                    }
                />
                <OppsummeringSvar
                    spoersmaal={t('kontrakt.andreInntekterBeskrivelse')}
                    svar={inntekt?.andreInntekter?.beskrivelse}
                />
                <OppsummeringSvar
                    spoersmaal={t('kontrakt.paavirkeInntekt')}
                    svar={
                        inntekt?.noeSomKanPaavirkeInntekten?.valg
                            ? t(`kontrakt.${inntekt.noeSomKanPaavirkeInntekten.valg}`)
                            : undefined
                    }
                />
                <OppsummeringSvar
                    spoersmaal={t('kontrakt.grunnTilPaavirkelseAvInntekt')}
                    svar={
                        inntekt?.noeSomKanPaavirkeInntekten?.grunnTilPaavirkelseAvInntekt
                            ? t(`kontrakt.${inntekt.noeSomKanPaavirkeInntekten.grunnTilPaavirkelseAvInntekt}`)
                            : undefined
                    }
                />
                <OppsummeringSvar
                    spoersmaal={t('kontrakt.endringBeskrivelse')}
                    svar={inntekt?.noeSomKanPaavirkeInntekten?.beskrivelse}
                />
            </OppsummeringSeksjon>

            <OppsummeringSeksjon tittel={t('skjema.dokumentasjon')} endrePath="dokumentasjon">
                <OppsummeringSvar
                    spoersmaal={t('oppsummering.dokumentasjon.status')}
                    svar={t('oppsummering.dokumentasjon.ingen')}
                />
            </OppsummeringSeksjon>
        </VStack>
    )
}
