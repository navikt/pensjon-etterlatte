import { defineField, defineType } from 'sanity'
import { spraakBlockFields } from '../spraak'

export const meldInnEndringOppsummering = defineType({
    name: 'meldInnEndringOppsummering',
    title: '3 - Oppsummering av endring',
    type: 'document',
    fields: [
        defineField({
            name: 'dokumentTittel',
            title: 'Dokument tittel',
            type: 'string',
        }),
        defineField({
            name: 'veiledning',
            title: 'Veiledning',
            type: 'object',
            fields: spraakBlockFields,
        }),
    ],
})
