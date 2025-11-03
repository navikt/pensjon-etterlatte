import { defineField, defineType } from 'sanity'
import { spraakBlockFields, spraakStringFields } from '../spraak'

export const meldInnEndringOppsummeringSchemaType = defineType({
    name: 'meldInnEndringOppsummering',
    title: '3 - Oppsummering av endring',
    type: 'document',
    fields: [
        defineField({
            name: 'dokumentTittel',
            title: 'Dokument tittel',
            type: 'string',
        }),
        defineField({
            name: 'veiledning',
            title: 'Veiledning',
            type: 'object',
            fields: spraakBlockFields,
        }),
        defineField({
            name: 'skjemaSammendrag',
            title: 'Skjema sammendrag',
            type: 'object',
            fields: [
                defineField({
                    name: 'tittel',
                    title: 'Tittel',
                    type: 'object',
                    fields: spraakStringFields,
                }),
                defineField({
                    name: 'endreSvarLenke',
                    title: 'Endre svar lenke',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'tekst',
                            title: 'Tekst',
                            type: 'object',
                            fields: spraakStringFields,
                        }),
                    ],
                }),
                defineField({
                    name: 'endring',
                    title: 'Endring',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'label',
                            title: 'Label',
                            type: 'object',
                            fields: spraakStringFields,
                        }),
                        defineField({
                            name: 'value',
                            title: 'Value',
                            type: 'object',
                            fields: [
                                defineField({
                                    name: 'aktivitetOgInntekt',
                                    title: 'Aktivitet og inntekt',
                                    type: 'object',
                                    fields: spraakStringFields,
                                }),
                                defineField({
                                    name: 'inntekt',
                                    title: 'Inntekt',
                                    type: 'object',
                                    fields: spraakStringFields,
                                }),
                                defineField({
                                    name: 'svarPaaEtteroppgjoer',
                                    title: 'Svar på etteroppgjør',
                                    type: 'object',
                                    fields: spraakStringFields,
                                }),
                                defineField({
                                    name: 'forventetInntektTilNesteAar',
                                    title: 'Forventet inntekt til neste år',
                                    type: 'object',
                                    fields: spraakStringFields,
                                }),
                                defineField({
                                    name: 'annet',
                                    title: 'Annet',
                                    type: 'object',
                                    fields: spraakStringFields,
                                }),
                            ],
                        }),
                    ],
                }),
                defineField({
                    name: 'beskrivelseAvEndring',
                    title: 'Beksrivelse av endring',
                    type: 'object',
                    fields: [
                        defineField({ name: 'label', title: 'Label', type: 'object', fields: spraakStringFields }),
                    ],
                }),
                defineField({
                    name: 'skalGaaAvMedAlderspensjon',
                    title: 'Skal gå av med alderspensjon',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'label',
                            title: 'Label',
                            type: 'object',
                            fields: [
                                defineField({
                                    name: 'femtiSyvTilSekstiSeksAar',
                                    title: '57-66 år',
                                    type: 'object',
                                    fields: spraakStringFields,
                                }),
                                defineField({
                                    name: 'sekstiSyvAar',
                                    title: '67 år',
                                    type: 'object',
                                    fields: spraakStringFields,
                                }),
                            ],
                        }),
                        defineField({
                            name: 'value',
                            title: 'Value',
                            type: 'object',
                            fields: [
                                defineField({
                                    name: 'ja',
                                    title: 'Ja',
                                    type: 'object',
                                    fields: spraakStringFields,
                                }),
                                defineField({
                                    name: 'nei',
                                    title: 'Nei',
                                    type: 'object',
                                    fields: spraakStringFields,
                                }),
                                defineField({
                                    name: 'vetIkke',
                                    title: 'Vet ikke',
                                    type: 'object',
                                    fields: spraakStringFields,
                                }),
                            ],
                        }),
                    ],
                }),
                defineField({
                    name: 'datoForAaGaaAvMedAlderspensjon',
                    title: 'Dato for å gå av med alderspensjon',
                    type: 'object',
                    fields: [
                        defineField({ name: 'label', title: 'Label', type: 'object', fields: spraakStringFields }),
                    ],
                }),
                defineField({
                    name: 'arbeidsinntekt',
                    title: 'Arbeidsinntekt',
                    type: 'object',
                    fields: [
                        defineField({ name: 'label', title: 'Label', type: 'object', fields: spraakStringFields }),
                    ],
                }),
                defineField({
                    name: 'naeringsinntekt',
                    title: 'Næringsinntekt',
                    type: 'object',
                    fields: [
                        defineField({ name: 'label', title: 'Label', type: 'object', fields: spraakStringFields }),
                    ],
                }),
                defineField({
                    name: 'AFPInntekt',
                    title: 'AFP inntekt',
                    type: 'object',
                    fields: [
                        defineField({ name: 'label', title: 'Label', type: 'object', fields: spraakStringFields }),
                    ],
                }),
                defineField({
                    name: 'AFPTjenesteordning',
                    title: 'AFP Tjenesteordning',
                    type: 'object',
                    fields: [
                        defineField({ name: 'label', title: 'Label', type: 'object', fields: spraakStringFields }),
                    ],
                }),
                defineField({
                    name: 'inntektFraUtland',
                    title: 'Alle inntekter fra utland',
                    type: 'object',
                    fields: [
                        defineField({ name: 'label', title: 'Label', type: 'object', fields: spraakStringFields }),
                    ],
                }),
            ],
        }),
        defineField({
            name: 'feilIOppretelseAvEndring',
            title: 'Feil i opprettelse av endring',
            type: 'object',
            fields: [
                defineField({ name: 'tittel', title: 'Tittel', type: 'object', fields: spraakStringFields }),
                defineField({ name: 'innhold', title: 'Innhold', type: 'object', fields: spraakBlockFields }),
            ],
        }),
    ],
})
