import { defineField, defineType } from 'sanity'
import { spraakStringFields } from '../spraak'

export const spraakVelgerSchemaType = defineType({
    name: 'spraakVelger',
    title: 'Språk velger',
    type: 'document',
    fields: [
        defineField({
            name: 'dokumentTittel',
            title: 'Dokument tittel',
            type: 'string',
        }),
        defineField({
            name: 'label',
            title: 'Label',
            type: 'object',
            options: {
                collapsible: true,
                collapsed: false,
            },
            fields: spraakStringFields,
        }),
    ],
})
