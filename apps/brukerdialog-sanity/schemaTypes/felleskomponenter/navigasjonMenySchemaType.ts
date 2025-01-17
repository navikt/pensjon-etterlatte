import { defineField, defineType } from 'sanity'
import { spraakStringFields } from '../spraak'

export const navigasjonMenySchemaType = defineType({
    name: 'navigasjonMeny',
    title: 'Navigasjon meny',
    type: 'document',
    fields: [
        defineField({
            name: 'dokumentTittel',
            title: 'Dokument tittel',
            type: 'string',
        }),
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
            name: 'sendTilNavKnapp',
            title: 'Send til Nav knapp',
            type: 'object',
            fields: spraakStringFields,
        }),
    ],
})
