import { describe, expect, it } from 'vitest'
import { ISoeknad, tomSoeknad } from '../context/soknad/soknad'
import { Language } from '../i18n'
import en from '../locales/en'
import nb from '../locales/nb'
import nn from '../locales/nn'
import { SituasjonenDinKladd, Skjema, UtdanningOgTiltakKladd } from '../typer/skjema'
import utdanning from './fixtures/utvidet_omstillingsstoenad.json'
import samboer from './fixtures/utvidet_omstillingsstoenad_ny_samboer.json'
import tiltak from './fixtures/utvidet_omstillingsstoenad_tiltak.json'
import { mapSoeknad } from './mapSoeknad'

const person = { fornavn: 'KALD', etternavn: 'FOLK', foedselsnummer: '24876696580' }
const tekst = (key: string) => {
    const verdi = Object.entries(nb).find(([noekkel]) => noekkel === key)?.[1]
    if (!verdi) throw new Error(`Mangler oversettelse: ${key}`)
    return verdi
}
const grunnlag: Skjema = {
    situasjonenDinIDag: { nySivilstand: 'INGEN_AV_DELENE' },
    utdanningOgTiltak: { aktivitet: 'INGEN' },
    inntekt: {
        arbeidsinntekt: '250 000',
        naeringsinntekt: '0',
        inntektFraUtland: '0',
        andreInntekter: { valg: 'NEI' },
        noeSomKanPaavirkeInntekten: { valg: 'NEI' },
    },
}
const kladd = (skjema: Skjema = grunnlag): ISoeknad => ({
    ...tomSoeknad,
    harSamtykket: true,
    spraak: Language.NORSK_BOKMAAL,
    skjema,
})

describe('Mapping til kontrakten i felles', () => {
    it('Mapper utdanning til eksempel-JSON uten kladdmetadata', () => {
        const state = kladd({
            ...grunnlag,
            utdanningOgTiltak: {
                aktivitet: 'UTDANNING',
                utdanning: {
                    studiested: 'OsloMet',
                    studie: 'Sykepleie',
                    startDato: '2026-08-15',
                    sluttDato: '2029-06-15',
                    studieform: 'DELTID',
                    studieprosent: '60',
                },
                aktivitetsplan: 'JA',
            },
        })
        const { mottattDato: _dato, ...forventet } = utdanning
        const { aktivitetsplan: _plan, ...forventetAktivitet } = forventet.utdanningOgTiltak
        expect(mapSoeknad(state, person, 'abc123', tekst)).toEqual({
            ...forventet,
            utdanningOgTiltak: forventetAktivitet,
            inntekt: { ...forventet.inntekt, afpInntekt: null },
            utbetalingsInformasjon: null,
        })
        expect(state.skjema.inntekt?.arbeidsinntekt).toBe('250 000')
    })

    it('Mapper ny samboer til eksempel-JSON med null inntekt (Å2)', () => {
        const state = kladd({
            ...grunnlag,
            situasjonenDinIDag: {
                nySivilstand: 'NY_SAMBOER',
                samboer: {
                    fornavn: 'TRADISJONSBUNDEN',
                    etternavn: 'KØYESENG',
                    foedselsnummer: '13848599411',
                    fellesBarnEllertidligereGift: 'NEI',
                },
            },
            inntekt: { ...grunnlag.inntekt!, arbeidsinntekt: '400000' },
        })
        const { mottattDato: _dato, ...forventet } = samboer
        expect(mapSoeknad(state, person, 'abc123', tekst)).toEqual({
            ...forventet,
            situasjonenDinIDag: {
                nySivilstand: {
                    ...forventet.situasjonenDinIDag.nySivilstand,
                    opplysning: { ...forventet.situasjonenDinIDag.nySivilstand.opplysning, inntekt: null },
                },
            },
            utdanningOgTiltak: {
                aktivitet: {
                    ...forventet.utdanningOgTiltak.aktivitet,
                    svar: { verdi: 'INGEN', innhold: tekst('kontrakt.INGEN') },
                },
            },
            inntekt: { ...forventet.inntekt, afpInntekt: null },
            utbetalingsInformasjon: null,
        })
    })

    it('Mapper tiltak, andre inntekter og inntektsendring til eksempel-JSON', () => {
        const state = kladd({
            ...grunnlag,
            utdanningOgTiltak: {
                aktivitet: 'ARBEIDSRETTET_TILTAK',
                arbeidsrettetTiltak: { tiltak: 'Arbeidstrening', omfang: 'HELTID' },
                aktivitetsplan: 'NEI',
            },
            inntekt: {
                ...grunnlag.inntekt!,
                arbeidsinntekt: '120000',
                andreInntekter: { valg: 'JA', inntekt: '30 000', beskrivelse: 'Utleie av hybel' },
                noeSomKanPaavirkeInntekten: {
                    valg: 'JA',
                    grunnTilPaavirkelseAvInntekt: 'ANNEN_GRUNN',
                    beskrivelse: 'Tiltaket er ferdig til sommeren',
                },
            },
        })
        const { mottattDato: _dato, ...forventet } = tiltak
        expect(mapSoeknad(state, person, 'abc123', tekst)).toEqual({
            ...forventet,
            situasjonenDinIDag: {
                nySivilstand: { ...forventet.situasjonenDinIDag.nySivilstand, opplysning: null },
            },
            utdanningOgTiltak: {
                ...forventet.utdanningOgTiltak,
                aktivitet: {
                    ...forventet.utdanningOgTiltak.aktivitet,
                    svar: { verdi: 'ARBEIDSRETTET_TILTAK', innhold: tekst('kontrakt.ARBEIDSRETTET_TILTAK') },
                },
            },
            inntekt: {
                ...forventet.inntekt,
                afpInntekt: null,
                noeSomKanPaavirkeInntekten: {
                    ...forventet.inntekt.noeSomKanPaavirkeInntekten,
                    grunnTilPaavirkelseAvInntekt: {
                        ...forventet.inntekt.noeSomKanPaavirkeInntekten.grunnTilPaavirkelseAvInntekt,
                        spoersmaal: tekst('kontrakt.grunnTilPaavirkelseAvInntekt'),
                    },
                },
            },
            utbetalingsInformasjon: null,
        })
    })

    it('Sender ikke skjulte svar fra tidligere valg', () => {
        const resultat = mapSoeknad(
            kladd({
                ...grunnlag,
                situasjonenDinIDag: {
                    nySivilstand: 'GIFTET_PAA_NYTT',
                    samboer: { ...person, fellesBarnEllertidligereGift: 'JA' },
                },
                utdanningOgTiltak: {
                    aktivitet: 'INGEN',
                    arbeidsrettetTiltak: { tiltak: 'Gammelt tiltak', omfang: 'DELTID' },
                    aktivitetsplan: 'JA',
                },
                inntekt: {
                    ...grunnlag.inntekt!,
                    andreInntekter: { valg: 'NEI', inntekt: '100', beskrivelse: 'Gammelt svar' },
                    noeSomKanPaavirkeInntekten: { valg: 'VET_IKKE', beskrivelse: 'Gammelt svar' },
                },
            }),
            person,
            'abc123',
            tekst
        )
        expect(resultat.situasjonenDinIDag.nySivilstand.opplysning).toBeNull()
        expect(resultat.utdanningOgTiltak).toEqual({ aktivitet: expect.any(Object) })
        expect(resultat.inntekt.andreInntekter).toEqual({ valg: expect.any(Object) })
        expect(resultat.inntekt.noeSomKanPaavirkeInntekten).toEqual({ valg: expect.any(Object) })
    })

    it.each(['', '-1', '1.5', 'abc'])('Avviser ugyldig beløp %s', (verdi) => {
        expect(() =>
            mapSoeknad(
                kladd({
                    ...grunnlag,
                    inntekt: { ...grunnlag.inntekt!, arbeidsinntekt: verdi },
                }),
                person,
                'abc123',
                tekst
            )
        ).toThrow('Beløp må være et heltall')
    })

    it('Avviser manglende samtykke og ufullstendig søknad', () => {
        expect(() => mapSoeknad(tomSoeknad, person, 'abc123', tekst)).toThrow('samtykke')
        expect(() => mapSoeknad(kladd({}), person, 'abc123', tekst)).toThrow('situasjonenDinIDag')
        expect(() =>
            mapSoeknad(
                kladd({
                    ...grunnlag,
                    utdanningOgTiltak: { aktivitet: 'UTDANNING' },
                }),
                person,
                'abc123',
                tekst
            )
        ).toThrow('utdanning')
    })

    it.each<[SituasjonenDinKladd, string]>([
        [{}, 'nySivilstand'],
        [{ nySivilstand: 'NY_SAMBOER' }, 'samboer'],
        [{ nySivilstand: 'NY_SAMBOER', samboer: { fornavn: 'Test' } }, 'etternavn'],
        [{ nySivilstand: 'NY_SAMBOER', samboer: { ...person } }, 'fellesBarnEllertidligereGift'],
    ])('Avviser ufullstendig situasjonskladd ved kontraktmapping', (situasjon, felt) => {
        expect(() =>
            mapSoeknad(kladd({ ...grunnlag, situasjonenDinIDag: situasjon }), person, 'abc123', tekst)
        ).toThrow(felt)
    })

    it.each<[UtdanningOgTiltakKladd, string]>([
        [{}, 'aktivitet'],
        [{ aktivitet: 'UTDANNING', utdanning: {} }, 'studiested'],
        [{ aktivitet: 'UTDANNING', utdanning: { studiested: 'Skole' } }, 'studie'],
        [{ aktivitet: 'ARBEIDSRETTET_TILTAK' }, 'arbeidsrettetTiltak'],
        [{ aktivitet: 'ARBEIDSRETTET_TILTAK', arbeidsrettetTiltak: {} }, 'tiltak'],
        [{ aktivitet: 'ARBEIDSRETTET_TILTAK', arbeidsrettetTiltak: { tiltak: 'Tiltak' } }, 'omfang'],
        [
            {
                aktivitet: 'ARBEIDSRETTET_TILTAK',
                arbeidsrettetTiltak: { tiltak: 'Tiltak', omfang: 'HELTID' },
            },
            'aktivitetsplan',
        ],
    ])('Avviser ufullstendig utdannings- og tiltakskladd ved kontraktmapping', (aktivitet, felt) => {
        expect(() => mapSoeknad(kladd({ ...grunnlag, utdanningOgTiltak: aktivitet }), person, 'abc123', tekst)).toThrow(
            felt
        )
    })

    it.each([
        [Language.NORSK_BOKMAAL, nb],
        [Language.NORSK_NYNORSK, nn],
        [Language.ENGELSK, en],
    ] as const)('Mapper utdanningssvar og datoer fra steget på %s, uten skjulte felt', (spraak, locale) => {
        const oversett = (key: string) => locale[key as keyof typeof locale]
        const data: UtdanningOgTiltakKladd = {
            aktivitet: 'UTDANNING',
            utdanning: {
                studiested: 'OsloMet',
                studie: 'Sykepleie',
                startDato: '2026-08-15',
                sluttDato: '2029-06-15',
                studieform: 'HELTID',
                studieprosent: '40',
            },
            arbeidsrettetTiltak: { tiltak: 'Gammelt tiltak', omfang: 'DELTID' },
            aktivitetsplan: 'JA',
        }
        const soeknad = { ...kladd({ ...grunnlag, utdanningOgTiltak: data }), spraak }
        const resultat = mapSoeknad(soeknad, person, 'abc123', oversett).utdanningOgTiltak
        expect(resultat.aktivitet).toEqual({
            spoersmaal: locale['kontrakt.aktivitet'],
            svar: { verdi: 'UTDANNING', innhold: locale['kontrakt.UTDANNING'] },
        })
        expect(resultat.utdanning).toMatchObject({
            studiested: { spoersmaal: locale['kontrakt.studiested'], svar: { innhold: 'OsloMet' } },
            startDato: { spoersmaal: locale['kontrakt.startDato'], svar: { innhold: '2026-08-15' } },
            sluttDato: { spoersmaal: locale['kontrakt.sluttDato'], svar: { innhold: '2029-06-15' } },
            studieform: {
                spoersmaal: locale['kontrakt.studieform'],
                svar: { verdi: 'HELTID', innhold: locale['kontrakt.HELTID'] },
            },
        })
        expect(resultat.utdanning).not.toHaveProperty('studieprosent')
        expect(resultat).not.toHaveProperty('arbeidsrettetTiltak')
        expect(resultat).not.toHaveProperty('aktivitetsplan')
        for (const verdi of ['', undefined]) {
            const ugyldig = {
                ...soeknad,
                skjema: {
                    ...soeknad.skjema,
                    utdanningOgTiltak: { ...data, utdanning: { ...data.utdanning, startDato: verdi } },
                },
            }
            expect(() => mapSoeknad(ugyldig, person, 'abc123', oversett)).toThrow('startDato')
        }
    })

    it.each([
        [Language.NORSK_NYNORSK, nn],
        [Language.ENGELSK, en],
    ] as const)('Bruker spørsmål og svar på valgt språk %s', (spraak, locale) => {
        const oversett = (key: string) => {
            const verdi = Object.entries(locale).find(([noekkel]) => noekkel === key)?.[1]
            if (!verdi) throw new Error(`Mangler oversettelse: ${key}`)
            return verdi
        }
        const resultat = mapSoeknad({ ...kladd(), spraak }, person, 'abc123', oversett)
        expect(resultat.spraak).toBe(spraak)
        expect(resultat.situasjonenDinIDag.nySivilstand).toMatchObject({
            spoersmaal: locale['kontrakt.nySivilstand'],
            svar: { innhold: locale['kontrakt.INGEN_AV_DELENE'] },
        })
    })
})
