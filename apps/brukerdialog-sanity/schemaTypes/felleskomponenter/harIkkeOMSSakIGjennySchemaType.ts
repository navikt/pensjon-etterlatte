import { defineField, defineType } from 'sanity'
import { spraakBlockFields, spraakStringFields } from '../spraak'

export const harIkkeOMSSakIGjennySchemaType = defineType({
    name: 'harIkkeOMSSakIGjenny',
    title: 'Har ikke løpende OMS sak',
    type: 'document',
    fields: [
        defineField({
            name: 'dokumentTittel',
            title: 'Dokument tittel',
            type: 'string',
        }),
        defineField({ name: 'innhold', title: 'Innhold', type: 'object', fields: spraakBlockFields }),
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
