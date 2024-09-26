import { defineField, defineType } from 'sanity'
import { spraakBlockFields, spraakStringFields } from '../spraak'

const accordionFields = [
    defineField({
        name: 'tittel',
        title: 'Tittel',
        type: 'object',
        fields: spraakStringFields,
    }),
    defineField({
        name: 'innhold',
        title: 'Innhold',
        type: 'object',
        fields: spraakBlockFields,
    }),
]

const textFieldFields = [
    defineField({
        name: 'label',
        title: 'Label',
        type: 'object',
        fields: spraakStringFields,
    }),
    defineField({
        name: 'beskrivelse',
        title: 'Beskrivelse',
        type: 'object',
        fields: spraakStringFields,
    }),
]

export const inntektsjusteringInntektTilNesteAarSchemaType = defineType({
    name: 'inntektsjusteringInntektTilNesteAar',
    title: '2 - Utfylling av inntekt til neste år',
    type: 'document',
    fields: [
        defineField({
            name: 'dokumentTittel',
            title: 'Dokument tittel',
            type: 'string',
        }),
        defineField({
            name: 'hovedinnhold',
            title: 'Hovedinnhold',
            type: 'object',
            fields: spraakBlockFields,
        }),
        defineField({
            name: 'inntektAccordions',
            title: 'Inntekt accordions',
            type: 'object',
            fields: [
                defineField({
                    name: 'tittel',
                    title: 'Tittel',
                    type: 'object',
                    fields: spraakStringFields,
                }),
                defineField({
                    name: 'arbeidsinntekt',
                    title: 'Arbeidsinntekt',
                    type: 'object',
                    fields: accordionFields,
                }),
                defineField({
                    name: 'naeringsinntekt',
                    title: 'Næringsinntekt',
                    type: 'object',
                    fields: accordionFields,
                }),
                defineField({
                    name: 'AFPInntekt',
                    title: 'AFP inntekt',
                    type: 'object',
                    fields: accordionFields,
                }),
                defineField({
                    name: 'alleInntekterIUtland',
                    title: 'Alle inntekter i utland',
                    type: 'object',
                    fields: accordionFields,
                }),
            ],
        }),
        defineField({
            name: 'inntektTextFields',
            title: 'Inntekt text fields',
            type: 'object',
            fields: [
                defineField({
                    name: 'arbeidsinntekt',
                    title: 'Arbeidsinntekt',
                    type: 'object',
                    fields: textFieldFields,
                }),
                defineField({
                    name: 'naeringsinntekt',
                    title: 'Næringsinntekt',
                    type: 'object',
                    fields: textFieldFields,
                }),
                defineField({
                    name: 'AFPInntekt',
                    title: 'AFP inntekt',
                    type: 'object',
                    fields: textFieldFields,
                }),
                defineField({
                    name: 'alleInntekterIUtland',
                    title: 'Alle inntekter i utland',
                    type: 'object',
                    fields: textFieldFields,
                }),
                defineField({
                    name: 'errorMeldinger',
                    title: 'Error meldinger',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'inputInneholderBokstaver',
                            title: 'Input inneholder bokstaver',
                            type: 'object',
                            fields: spraakStringFields,
                        }),
                        defineField({
                            name: 'inputErNegativ',
                            title: 'Input er negativ',
                            type: 'object',
                            fields: spraakStringFields,
                        }),
                    ],
                }),
            ],
        }),
        defineField({
            name: 'sumAvInntekt',
            title: 'Sum av inntekt',
            type: 'object',
            fields: spraakStringFields,
        }),
    ],
})
