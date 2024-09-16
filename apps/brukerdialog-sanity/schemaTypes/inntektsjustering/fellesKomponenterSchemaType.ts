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
            name: 'spraakVelger',
            title: 'Språk velger',
            type: 'object',
            options: {
                collapsible: true,
                collapsed: true,
            },
            fields: [
                defineField({
                    name: 'label',
                    title: 'Label',
                    type: 'object',
                    options: {
                        collapsible: true,
                        collapsed: false,
                    },
                    fields: spraakStringFields,
                }),
            ],
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
            name: 'knappMeny',
            title: 'Knapp meny',
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
    ],
})
