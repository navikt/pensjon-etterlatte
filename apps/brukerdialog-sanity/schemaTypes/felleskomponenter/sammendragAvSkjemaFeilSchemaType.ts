import { defineField, defineType } from 'sanity'
import { spraakStringFields } from '../spraak'

export const sammendragAvSkjemaFeilSchemaType = defineType({
    name: 'sammendragAvSkjemaFeil',
    title: 'Sammendrag av skjema feil',
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
    ],
})
