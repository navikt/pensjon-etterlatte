import { defineField, defineType } from 'sanity'

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
                    fields: [
                        defineField({ name: 'NB', type: 'string' }),
                        defineField({ name: 'NN', type: 'string' }),
                        defineField({ name: 'EN', type: 'string' }),
                    ],
                }),
            ],
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
                            fields: [
                                defineField({ name: 'NB', type: 'string' }),
                                defineField({ name: 'NN', type: 'string' }),
                                defineField({ name: 'EN', type: 'string' }),
                            ],
                        }),
                        defineField({
                            name: 'av',
                            title: 'av',
                            type: 'object',
                            options: {
                                collapsible: true,
                                collapsed: true,
                            },
                            fields: [
                                defineField({ name: 'NB', type: 'string' }),
                                defineField({ name: 'NN', type: 'string' }),
                                defineField({ name: 'EN', type: 'string' }),
                            ],
                        }),
                    ],
                }),
                defineField({
                    name: 'visAlleSteg',
                    title: 'Vis alle steg',
                    type: 'object',
                    fields: [
                        defineField({ name: 'NB', type: 'string' }),
                        defineField({ name: 'NN', type: 'string' }),
                        defineField({ name: 'EN', type: 'string' }),
                    ],
                }),
                defineField({
                    name: 'skjulAlleSteg',
                    title: 'Skjul alle steg',
                    type: 'object',
                    fields: [
                        defineField({ name: 'NB', type: 'string' }),
                        defineField({ name: 'NN', type: 'string' }),
                        defineField({ name: 'EN', type: 'string' }),
                    ],
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
                            fields: [
                                defineField({ name: 'NB', type: 'string' }),
                                defineField({ name: 'NN', type: 'string' }),
                                defineField({ name: 'EN', type: 'string' }),
                            ],
                        }),
                        defineField({
                            name: 'steg2',
                            title: 'Steg 2',
                            type: 'object',
                            options: {
                                collapsible: true,
                                collapsed: true,
                            },
                            fields: [
                                defineField({ name: 'NB', type: 'string' }),
                                defineField({ name: 'NN', type: 'string' }),
                                defineField({ name: 'EN', type: 'string' }),
                            ],
                        }),
                        defineField({
                            name: 'steg3',
                            title: 'Steg 3',
                            type: 'object',
                            options: {
                                collapsible: true,
                                collapsed: true,
                            },
                            fields: [
                                defineField({ name: 'NB', type: 'string' }),
                                defineField({ name: 'NN', type: 'string' }),
                                defineField({ name: 'EN', type: 'string' }),
                            ],
                        }),
                        defineField({
                            name: 'steg4',
                            title: 'Steg 4',
                            type: 'object',
                            options: {
                                collapsible: true,
                                collapsed: true,
                            },
                            fields: [
                                defineField({ name: 'NB', type: 'string' }),
                                defineField({ name: 'NN', type: 'string' }),
                                defineField({ name: 'EN', type: 'string' }),
                            ],
                        }),
                    ],
                }),
            ],
        }),
    ],
})
