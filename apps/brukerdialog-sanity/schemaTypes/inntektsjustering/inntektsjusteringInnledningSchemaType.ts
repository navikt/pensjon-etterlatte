import { defineField, defineType } from 'sanity'
import { spraakBlockFields, spraakStringFields } from '../spraak'

export const inntektsjusteringInnledningSchemaType = defineType({
    name: 'inntektsjusteringInnledning',
    title: 'Innledning til inntektsjustering',
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
            name: 'info',
            title: 'Info',
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