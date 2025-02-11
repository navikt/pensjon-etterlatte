import { defineField, defineType } from 'sanity'
import { spraakStringFields } from '../spraak'

export const textareaSchemaType = defineType({
    name: 'textarea',
    title: 'Textarea',
    type: 'document',
    fields: [
        defineField({
            name: 'dokumentTittel',
            title: 'Dokument tittel',
            type: 'string',
        }),
        defineField({
            name: 'tegnIgjen',
            title: 'Tegn igjen',
            type: 'object',
            fields: spraakStringFields
        }),
        defineField({
            name: 'forMangeTegn',
            title: 'For mange tegn',
            type: 'object',
            fields: spraakStringFields
        })
    ]
})