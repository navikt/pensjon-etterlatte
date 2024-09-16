import { defineField, defineType } from 'sanity'

export const inntektsjusteringOppsummeringSchemaType = defineType({
    name: 'inntektsjusteringOppsummering',
    title: 'Oppsummering av utfylt inntekt',
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
            fields: [
                defineField({ name: 'NB', type: 'array', of: [{ type: 'block' }] }),
                defineField({ name: 'NN', type: 'array', of: [{ type: 'block' }] }),
                defineField({ name: 'EN', type: 'array', of: [{ type: 'block' }] }),
            ],
        }),
        defineField({
            name: 'skjemaSammendrag',
            title: 'Skjema sammendrag',
            type: 'object',
            fields: [
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
                    name: 'endreSvarLenke',
                    title: 'Endre svar lenke',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'tekst',
                            title: 'Tekst',
                            type: 'object',
                            fields: [
                                defineField({ name: 'NB', type: 'string' }),
                                defineField({ name: 'NN', type: 'string' }),
                                defineField({ name: 'EN', type: 'string' }),
                            ],
                        }),
                    ],
                }),
            ],
        }),
    ],
})
