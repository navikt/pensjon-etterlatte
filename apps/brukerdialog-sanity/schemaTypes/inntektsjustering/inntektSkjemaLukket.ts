import { defineField, defineType } from 'sanity'
import { spraakBlockFields, spraakStringFields } from '../spraak'

export const inntektSkjemaLukketSchemaType = defineType({
    name: 'inntektSkjemaLukket',
    title: 'Inntekt skjema lukket',
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
            name: 'gaaTilNAVKnapp',
            title: 'Gå til nav knapp',
            type: 'object',
            fields: [
                defineField({
                    name: 'tekst',
                    title: 'Tekst',
                    type: 'object',
                    fields: spraakStringFields,
                }),
                defineField({
                    name: 'lenke',
                    title: 'Lenke',
                    type: 'object',
                    fields: spraakStringFields,
                }),
            ],
        }),
    ],
})
