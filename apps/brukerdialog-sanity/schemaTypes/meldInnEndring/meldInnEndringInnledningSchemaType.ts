import { defineField, defineType } from 'sanity'
import { spraakBlockFields, spraakStringFields } from '../spraak'

export const meldInnEndringInnledningSchemaType = defineType({
    name: 'meldInnEndringInnledning',
    title: '1 - Innledning til meld inn endring',
    type: 'document',
    fields: [
        defineField({
            name: 'dokumentTittel',
            title: 'Dokument tittel',
            type: 'string',
        }),
        defineField({
            name: 'tittel',
            title: 'Tittel',
            type: 'object',
            fields: spraakStringFields,
        }),
        defineField({
            name: 'veiledning',
            title: 'Veiledning',
            type: 'object',
            fields: spraakBlockFields,
        }),
        defineField({
            name: 'startUtfyllingKnapp',
            title: 'Start utfylling knapp',
            type: 'object',
            fields: spraakStringFields,
        }),
    ],
})
