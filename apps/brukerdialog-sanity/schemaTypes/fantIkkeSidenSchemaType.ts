import { defineField, defineType } from 'sanity'
import { spraakBlockFields } from './spraak'

export const fantIkkeSidenSchemaType = defineType({
    name: 'fantIkkeSiden',
    title: '404 - fant ikke siden',
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
    ],
})
