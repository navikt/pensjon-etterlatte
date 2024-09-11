import { defineField, defineType } from 'sanity'

export const fellesKomponenter = defineType({
    name: 'fellesKomponenter',
    title: 'Felles komponenter',
    type: 'document',
    fields: [
        defineField({
            name: 'skjemaProgresjon',
            title: 'Skjema progresjon',
            type: 'object',
            fields: [
                defineField({
                    name: 'stegTeller',
                    title: 'Steg teller',
                    type: 'object',
                    fields: [
                        defineField({ name: 'NB', type: 'string' }),
                        defineField({ name: 'NN', type: 'string' }),
                        defineField({ name: 'EN', type: 'string' }),
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
                    name: 'alleSteg',
                    title: 'Alle steg',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'steg1',
                            title: 'Steg 1',
                            type: 'object',
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
