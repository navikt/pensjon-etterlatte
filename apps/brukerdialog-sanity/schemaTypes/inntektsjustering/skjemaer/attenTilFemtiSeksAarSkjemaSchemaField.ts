import { defineField } from 'sanity'
import { textFieldSchemaFields } from './fellesSchemaFields'

export const attenTilFemtiSeksAarSkjemaSchemaField = defineField({
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
            fields: textFieldSchemaFields,
        }),
        defineField({
            name: 'naeringsinntekt',
            title: 'Næringsinntekt',
            type: 'object',
            fields: textFieldSchemaFields,
        }),
        defineField({
            name: 'inntektFraUtland',
            title: 'Alle inntekter fra utland',
            type: 'object',
            fields: textFieldSchemaFields,
        }),
    ],
})
