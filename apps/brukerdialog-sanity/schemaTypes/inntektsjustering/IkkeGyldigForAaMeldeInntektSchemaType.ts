import { defineField, defineType } from 'sanity'
import { spraakBlockFields, spraakStringFields } from '../spraak'

export const ikkeGyldigForAaMeldeInntektSchemaType = defineType({
    name: 'ikkeGyldigForAaMeldeInnInntekt',
    title: 'Ikke gyldig for å melde inn inntekt',
    type: 'document',
    fields: [
        defineField({
            name: 'dokumentTittel',
            title: 'Dokument tittel',
            type: 'string',
        }),
        defineField({
            name: 'ikkeGyldigAlder',
            title: 'Alder ikke gyldig for å melde inn inntekt',
            type: 'object',
            fields: [
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
        }),
        defineField({
            name: 'harIkkeOMSSakIGjenny',
            title: 'Har ikke OMS sak i Gjenny',
            type: 'object',
            fields: [
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
        }),
        defineField({
            name: 'feilVedSjekkAvOMSSakIGjenny',
            title: 'Feil ved sjekk av OMS sak i Gjenny',
            type: 'object',
            fields: [defineField({ name: 'innhold', title: 'Innhold', type: 'object', fields: spraakBlockFields })],
        }),
    ],
})
