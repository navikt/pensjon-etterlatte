import { defineField, defineType } from 'sanity'
import { spraakBlockFields, spraakStringFields } from '../spraak'

export const inntektsjusteringKvitteringSchemaType = defineType({
    name: 'inntektsjusteringKvittering',
    title: '4 - Kvittering etter inntekt er sendt inn',
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
            name: 'suksess',
            title: 'Suksess',
            type: 'object',
            fields: spraakBlockFields,
        }),
        defineField({
            name: 'info',
            title: 'Info',
            type: 'object',
            fields: [
                defineField({
                    name: 'tittel',
                    title: 'Tittel',
                    type: 'object',
                    fields: spraakStringFields,
                }),
                defineField({
                    name: 'beskrivelse',
                    title: 'Beskrivelse',
                    type: 'object',
                    fields: spraakBlockFields,
                }),
            ],
        }),
        defineField({
            name: 'gaaTilNAVKnapp',
            title: 'Gå til nav knapp',
            type: 'object',
            fields: spraakStringFields,
        }),
    ],
})
