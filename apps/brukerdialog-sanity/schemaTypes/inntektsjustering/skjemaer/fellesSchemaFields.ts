import { defineField } from 'sanity'
import { spraakBlockFields, spraakStringFields } from '../../spraak'

export const valgfriReadMoreSchemaField = defineField({
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
})

export const textFieldSchemaFields = [
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
    valgfriReadMoreSchemaField,
]

export const errorVedTomInputSchemaField = defineField({
    name: 'errorVedTomInput',
    title: 'Error ved tom input',
    type: 'object',
    fields: spraakStringFields,
})
