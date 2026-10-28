import { ISoeknad } from '../context/soknad/soknad'
import { Language } from '../i18n'
import { Inntekt, Person, SituasjonenDinKladd } from '../typer/skjema'
import { erGyldigBeloep, normaliserBeloep } from './inntekt'

const paakrevd = <T>(verdi: T | undefined, felt: string): T => {
    if (verdi === undefined || verdi === '') throw new Error(`Mangler påkrevd felt: ${felt}`)
    return verdi
}

const beloep = (verdi: string) => {
    if (!erGyldigBeloep(verdi)) throw new Error('Beløp må være et heltall større enn eller lik null')
    return normaliserBeloep(verdi)
}

export const mapSoeknad = (soeknad: ISoeknad, soeker: Person, imageTag: string, tekst: (key: string) => string) => {
    if (!soeknad.harSamtykket) throw new Error('Søknaden mangler samtykke')
    const situasjon: SituasjonenDinKladd = paakrevd(soeknad.skjema.situasjonenDinIDag, 'situasjonenDinIDag')
    const nySivilstand = paakrevd(situasjon.nySivilstand, 'nySivilstand')
    const aktivitet = paakrevd(soeknad.skjema.utdanningOgTiltak, 'utdanningOgTiltak')
    const aktivitetsvalg = paakrevd(aktivitet.aktivitet, 'aktivitet')
    const inntekt: Inntekt = paakrevd(soeknad.skjema.inntekt, 'inntekt')

    const opplysning = <T>(key: string, svar: T) => ({ spoersmaal: tekst(`kontrakt.${key}`), svar })
    const fritekst = (key: string, innhold: string) => opplysning(key, { innhold: paakrevd(innhold, key) })
    const valg = <T extends string>(key: string, verdi: T) =>
        opplysning(key, { verdi, innhold: tekst(`kontrakt.${verdi}`) })
    const person = (data: Partial<Person>, samboer = false) => ({
        fornavn: opplysning(samboer ? 'samboerFornavn' : 'fornavn', paakrevd(data.fornavn, 'fornavn')),
        etternavn: opplysning(samboer ? 'samboerEtternavn' : 'etternavn', paakrevd(data.etternavn, 'etternavn')),
        foedselsnummer: opplysning(
            samboer ? 'samboerFoedselsnummer' : 'foedselsnummer',
            paakrevd(data.foedselsnummer, 'foedselsnummer')
        ),
    })
    const samboer = situasjon.nySivilstand === 'NY_SAMBOER' ? paakrevd(situasjon.samboer, 'samboer') : undefined
    const utdanning = aktivitet.aktivitet === 'UTDANNING' ? paakrevd(aktivitet.utdanning, 'utdanning') : undefined
    const tiltak =
        aktivitet.aktivitet === 'ARBEIDSRETTET_TILTAK'
            ? paakrevd(aktivitet.arbeidsrettetTiltak, 'arbeidsrettetTiltak')
            : undefined
    const andre = inntekt.andreInntekter
    const endring = inntekt.noeSomKanPaavirkeInntekten

    return {
        type: 'UTVIDET_OMSTILLINGSSTOENAD' as const,
        imageTag,
        spraak: soeknad.spraak ?? Language.NORSK_BOKMAAL,
        harSamtykket: opplysning('samtykke', true),
        innsender: { type: 'INNSENDER' as const, ...person(soeker) },
        soeker: { type: 'GJENLEVENDE_UTVIDET_OMS' as const, ...person(soeker) },
        situasjonenDinIDag: {
            nySivilstand: {
                ...valg('nySivilstand', nySivilstand),
                opplysning: samboer
                    ? {
                          type: 'SAMBOER' as const,
                          ...person(samboer, true),
                          fellesBarnEllertidligereGift: valg(
                              'fellesBarnEllertidligereGift',
                              paakrevd(samboer.fellesBarnEllertidligereGift, 'fellesBarnEllertidligereGift')
                          ),
                          inntekt: null,
                      }
                    : null,
            },
        },
        utdanningOgTiltak: {
            aktivitet: valg('aktivitet', aktivitetsvalg),
            ...(utdanning
                ? {
                      utdanning: {
                          studiested: fritekst('studiested', paakrevd(utdanning.studiested, 'studiested')),
                          studie: fritekst('studie', paakrevd(utdanning.studie, 'studie')),
                          startDato: fritekst('startDato', paakrevd(utdanning.startDato, 'startDato')),
                          sluttDato: fritekst('sluttDato', paakrevd(utdanning.sluttDato, 'sluttDato')),
                          studieform: valg('studieform', paakrevd(utdanning.studieform, 'studieform')),
                          ...(utdanning.studieform === 'DELTID'
                              ? {
                                    studieprosent: fritekst(
                                        'studieprosent',
                                        paakrevd(utdanning.studieprosent, 'studieprosent')
                                    ),
                                }
                              : {}),
                      },
                  }
                : {}),
            ...(tiltak
                ? {
                      arbeidsrettetTiltak: {
                          tiltak: fritekst('tiltak', paakrevd(tiltak.tiltak, 'tiltak')),
                          omfang: valg('omfang', paakrevd(tiltak.omfang, 'omfang')),
                      },
                  }
                : {}),
            // Følger spesifikasjonen: aktivitetsplan hører bare til tiltak (Å1).
            ...(tiltak
                ? {
                      aktivitetsplan: valg('aktivitetsplan', paakrevd(aktivitet.aktivitetsplan, 'aktivitetsplan')),
                  }
                : {}),
        },
        inntekt: {
            arbeidsinntekt: fritekst('arbeidsinntekt', beloep(inntekt.arbeidsinntekt)),
            naeringsinntekt: { inntekt: fritekst('naeringsinntekt', beloep(inntekt.naeringsinntekt)) },
            afpInntekt: null,
            inntektFraUtland: fritekst('inntektFraUtland', beloep(inntekt.inntektFraUtland)),
            andreInntekter: {
                valg: valg('andreInntekter', paakrevd(andre.valg, 'andreInntekter.valg')),
                ...(andre.valg === 'JA'
                    ? {
                          inntekt: fritekst(
                              'sumAndreInntekter',
                              beloep(paakrevd(andre.inntekt, 'andreInntekter.inntekt'))
                          ),
                          beskrivelse: fritekst(
                              'andreInntekterBeskrivelse',
                              paakrevd(andre.beskrivelse, 'andreInntekter.beskrivelse')
                          ),
                      }
                    : {}),
            },
            noeSomKanPaavirkeInntekten: {
                valg: valg('paavirkeInntekt', paakrevd(endring.valg, 'noeSomKanPaavirkeInntekten.valg')),
                ...(endring.valg === 'JA'
                    ? {
                          grunnTilPaavirkelseAvInntekt: valg(
                              'grunnTilPaavirkelseAvInntekt',
                              paakrevd(endring.grunnTilPaavirkelseAvInntekt, 'grunnTilPaavirkelseAvInntekt')
                          ),
                          ...(endring.grunnTilPaavirkelseAvInntekt === 'ANNEN_GRUNN'
                              ? {
                                    beskrivelse: fritekst(
                                        'endringBeskrivelse',
                                        paakrevd(endring.beskrivelse, 'endringBeskrivelse')
                                    ),
                                }
                              : {}),
                      }
                    : {}),
            },
        },
        utbetalingsInformasjon: null,
    }
}
