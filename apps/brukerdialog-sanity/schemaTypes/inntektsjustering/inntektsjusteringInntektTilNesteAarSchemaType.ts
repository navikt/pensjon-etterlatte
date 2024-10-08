import { defineField, defineType } from 'sanity'
import { spraakBlockFields, spraakStringFields } from '../spraak'

const textFieldFields = [
    defineField({
        name: 'label',
        title: 'Label',
        type: 'object',
        fields: spraakStringFields,
    }),
    defineField({
        name: 'description',
        title: 'Description (valgfri)',
        type: 'object',
        fields: spraakStringFields,
    }),
    defineField({
        name: 'readMore',
        title: 'Read more (valgfri)',
        type: 'object',
        fields: [
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
        ],
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
            name: 'inntektSkjemaer',
            title: 'Inntekt skjemaer',
            type: 'object',
            fields: [
                defineField({
                    name: 'attenTilFemtiSeksAar',
                    title: '18 til 56 år',
                    options: {
                        collapsible: true,
                        collapsed: true,
                    },
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'arbeidsinntekt',
                            title: 'Arbeidsinntekt og andre utbetalinger',
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
                            name: 'inntektFraUtland',
                            title: 'Alle inntekter fra utland',
                            type: 'object',
                            fields: textFieldFields,
                        }),
                    ],
                }),
                defineField({
                    name: 'femtiSyvTilSekstiAarSkjema',
                    title: '57 til 60 år',
                    options: {
                        collapsible: true,
                        collapsed: false,
                    },
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'arbeidsinntekt',
                            title: 'Arbeidsinntekt og andre utbetalinger',
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
                            title: 'AFP offentlig eller privat',
                            type: 'object',
                            fields: textFieldFields,
                        }),
                        defineField({
                            name: 'AFPTjenestepensjonordning',
                            title: 'AFP tjenestepensjonordning',
                            type: 'object',
                            fields: [
                                ...textFieldFields,
                                defineField({
                                    name: 'tomInputError',
                                    title: 'Tom input error',
                                    type: 'object',
                                    fields: spraakStringFields,
                                }),
                            ],
                        }),
                        defineField({
                            name: 'inntektFraUtland',
                            title: 'Alle inntekter fra utland',
                            type: 'object',
                            fields: textFieldFields,
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
