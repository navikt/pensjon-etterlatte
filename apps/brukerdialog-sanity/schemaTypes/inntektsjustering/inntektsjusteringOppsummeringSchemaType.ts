import { defineField, defineType } from 'sanity'
import { spraakBlockFields, spraakStringFields } from '../spraak'

export const inntektsjusteringOppsummeringSchemaType = defineType({
    name: 'inntektsjusteringOppsummering',
    title: '3 - Oppsummering av utfylt inntekt',
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
        defineField({
            name: 'skjemaSammendrag',
            title: 'Skjema sammendrag',
            type: 'object',
            fields: [
                defineField({
                    name: 'tittel',
                    title: 'Tittel',
                    type: 'object',
                    fields: spraakStringFields,
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
                            fields: spraakStringFields,
                        }),
                    ],
                }),
            ],
        }),
        defineField({
            name: 'feilIOpprettelseAvInntekt',
            title: 'Feil i opprettelse av inntekt',
            type: 'object',
            fields: [
                defineField({ name: 'tittel', title: 'Tittel', type: 'object', fields: spraakStringFields }),
                defineField({ name: 'innhold', title: 'Innhold', type: 'object', fields: spraakBlockFields }),
            ],
        }),
    ],
})
