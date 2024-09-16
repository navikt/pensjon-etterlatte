import { defineField, defineType } from 'sanity'

export const innledningTilInntektsjusteringSchemaType = defineType({
    name: 'innledningTilInntektsjustering',
    title: 'InntektsjusteringInnledning til inntektsjustering',
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
            fields: [
                defineField({ name: 'NB', type: 'string' }),
                defineField({ name: 'NN', type: 'string' }),
                defineField({ name: 'EN', type: 'string' }),
            ],
        }),
        defineField({
            name: 'hovedinnhold',
            title: 'Hovedinnhold',
            type: 'object',
            fields: [
                defineField({ name: 'NB', type: 'array', of: [{ type: 'block' }] }),
                defineField({ name: 'NN', type: 'array', of: [{ type: 'block' }] }),
                defineField({ name: 'EN', type: 'array', of: [{ type: 'block' }] }),
            ],
        }),
        defineField({
            name: 'info',
            title: 'Info',
            type: 'object',
            fields: [
                defineField({ name: 'NB', type: 'string' }),
                defineField({ name: 'NN', type: 'string' }),
                defineField({ name: 'EN', type: 'string' }),
            ],
        }),
        defineField({
            name: 'veiledning',
            title: 'Veiledning',
            type: 'object',
            fields: [
                defineField({ name: 'NB', type: 'array', of: [{ type: 'block' }] }),
                defineField({ name: 'NN', type: 'array', of: [{ type: 'block' }] }),
                defineField({ name: 'EN', type: 'array', of: [{ type: 'block' }] }),
            ],
        }),
        defineField({
            name: 'startUtfyllingKnapp',
            title: 'Start utfylling knapp',
            type: 'object',
            fields: [
                defineField({ name: 'NB', type: 'string' }),
                defineField({ name: 'NN', type: 'string' }),
                defineField({ name: 'EN', type: 'string' }),
            ],
        }),
    ],
})
