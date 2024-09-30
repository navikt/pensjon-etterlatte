import { defineField, defineType } from 'sanity'
import { spraakBlockFields, spraakStringFields } from './spraak'

export const systemUtilgjengeligSchemaType = defineType({
    name: 'systemUtilgjengelig',
    title: '5XX - system utilgjengelig',
    type: 'document',
    fields: [
        defineField({
            name: 'dokumentTittel',
            title: 'Dokument tittel',
            type: 'string',
        }),
        defineField({
            name: 'statuskodeDetail',
            title: 'Statuskode detail',
            type: 'object',
            fields: spraakStringFields,
        }),
        defineField({
            name: 'hovedinnhold',
            title: 'Hovedinnhold',
            type: 'object',
            fields: spraakBlockFields,
        }),
        defineField({
            name: 'kontaktOss',
            title: 'Kontakt oss',
            type: 'object',
            fields: [
                defineField({ name: 'tekst', title: 'Tekst', type: 'object', fields: spraakStringFields }),
                defineField({
                    name: 'lenke',
                    title: 'Lenke',
                    type: 'object',
                    fields: [
                        defineField({ name: 'tekst', title: 'Tekst', type: 'object', fields: spraakStringFields }),
                        defineField({ name: 'url', title: 'URL', type: 'object', fields: spraakStringFields }),
                    ],
                }),
            ],
        }),
    ],
})
