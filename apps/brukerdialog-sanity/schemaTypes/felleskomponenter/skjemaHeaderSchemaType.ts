import { defineField, defineType } from 'sanity'
import { spraakStringFields } from '../spraak'

export const skjemaHeaderSchemaType = defineType({
    name: 'skjemaHeader',
    title: 'Skjema header',
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
                            fields: spraakStringFields,
                        }),
                        defineField({
                            name: 'av',
                            title: 'av',
                            type: 'object',
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
                            fields: spraakStringFields,
                        }),
                        defineField({
                            name: 'steg2',
                            title: 'Steg 2',
                            type: 'object',
                            fields: spraakStringFields,
                        }),
                        defineField({
                            name: 'steg3',
                            title: 'Steg 3',
                            type: 'object',
                            fields: spraakStringFields,
                        }),
                        defineField({
                            name: 'steg4',
                            title: 'Steg 4',
                            type: 'object',
                            fields: spraakStringFields,
                        }),
                    ],
                }),
            ],
        }),
    ],
})
