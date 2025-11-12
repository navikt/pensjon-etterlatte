import { defineField } from 'sanity'
import { textFieldSchemaFields } from '../../fellesSchemaFields'
import { spraakBlockFields } from '../../spraak'

export const attenTilSekstiEnAarSkjemaSchemaField = defineField({
    name: 'attenTilSekstiEnAarSkjema',
    title: '18 til 61 år',
    options: {
        collapsible: true,
        collapsed: true,
    },
    type: 'object',
    fields: [
        defineField({
            name: 'hovedinnhold',
            title: 'Hovedinnhold',
            type: 'object',
            fields: spraakBlockFields,
        }),
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
        defineField({
            name: 'sumAvInntekt',
            title: 'Sum av inntekt',
            type: 'object',
            fields: spraakBlockFields,
        }),
    ],
})
