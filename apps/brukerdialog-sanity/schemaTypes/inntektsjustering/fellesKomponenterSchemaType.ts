import { defineField, defineType } from 'sanity'
import { spraakStringFields } from '../spraak'

export const fellesKomponenterSchemaType = defineType({
    name: 'fellesKomponenter',
    title: 'Felles komponenter',
    type: 'document',
    fields: [
        defineField({
            name: 'dokumentTittel',
            title: 'Dokument tittel',
            type: 'string',
        }),
        defineField({
            name: 'skjemaTittel',
            title: 'Skjema tittel',
            type: 'object',
            fields: spraakStringFields,
        }),
        defineField({
            name: 'skjemaProgresjon',
            title: 'Skjema progresjon',
            type: 'object',
            options: {
                collapsible: true,
                collapsed: true,
            },
            fields: [
                defineField({
                    name: 'stegXAvX',
                    title: 'Steg x av x',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'steg',
                            title: 'Steg',
                            type: 'object',
                            options: {
                                collapsible: true,
                                collapsed: true,
                            },
                            fields: spraakStringFields,
                        }),
                        defineField({
                            name: 'av',
                            title: 'av',
                            type: 'object',
                            options: {
                                collapsible: true,
                                collapsed: true,
                            },
                            fields: spraakStringFields,
                        }),
                    ],
                }),
                defineField({
                    name: 'visAlleSteg',
                    title: 'Vis alle steg',
                    type: 'object',
                    fields: spraakStringFields,
                }),
                defineField({
                    name: 'skjulAlleSteg',
                    title: 'Skjul alle steg',
                    type: 'object',
                    fields: spraakStringFields,
                }),
                defineField({
                    name: 'stegLabels',
                    title: 'Steg labels',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'steg1',
                            title: 'Steg 1',
                            type: 'object',
                            options: {
                                collapsible: true,
                                collapsed: true,
                            },
                            fields: spraakStringFields,
                        }),
                        defineField({
                            name: 'steg2',
                            title: 'Steg 2',
                            type: 'object',
                            options: {
                                collapsible: true,
                                collapsed: true,
                            },
                            fields: spraakStringFields,
                        }),
                        defineField({
                            name: 'steg3',
                            title: 'Steg 3',
                            type: 'object',
                            options: {
                                collapsible: true,
                                collapsed: true,
                            },
                            fields: spraakStringFields,
                        }),
                        defineField({
                            name: 'steg4',
                            title: 'Steg 4',
                            type: 'object',
                            options: {
                                collapsible: true,
                                collapsed: true,
                            },
                            fields: spraakStringFields,
                        }),
                    ],
                }),
            ],
        }),
        defineField({
            name: 'navigasjonMeny',
            title: 'Navigasjon meny',
            type: 'object',
            fields: [
                defineField({
                    name: 'sistLagret',
                    title: 'Sist lagret',
                    type: 'object',
                    fields: spraakStringFields,
                }),
                defineField({
                    name: 'knapper',
                    title: 'Knapper',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'forrigeStegKnapp',
                            title: 'Forrige steg knapp',
                            type: 'object',
                            fields: spraakStringFields,
                        }),
                        defineField({
                            name: 'nesteStegKnapp',
                            title: 'Neste steg knapp',
                            type: 'object',
                            fields: spraakStringFields,
                        }),
                        defineField({
                            name: 'sendSoeknadKnapp',
                            title: 'Send søknad knapp',
                            type: 'object',
                            fields: spraakStringFields,
                        }),
                        defineField({
                            name: 'fortsettSenereKnapp',
                            title: 'Fortsett senere knapp',
                            type: 'object',
                            fields: spraakStringFields,
                        }),
                        defineField({
                            name: 'slettSoeknadenKnapp',
                            title: 'Slett søknaden knapp',
                            type: 'object',
                            fields: spraakStringFields,
                        }),
                    ],
                }),
            ],
        }),
        defineField({
            name: 'sammendragAvInntekt',
            title: 'Sammendrag av inntekt',
            type: 'object',
            fields: [
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
    ],
})
