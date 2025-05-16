import { defineField, defineType } from 'sanity'
import { spraakBlockFields, spraakStringFields } from '../spraak'

export const meldInnEndringKvitteringSchemaType = defineType({
    name: 'meldInnEndringKvittering',
    title: '4 - Kvittering etter at endring er meldt inn',
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
           name: 'svarPaEtteroppgjoerSuksess',
           title: 'Svar på etteroppgjør suksess',
           type: 'object',
           fields: spraakStringFields
        }),
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
        defineField({
            name: 'ettersendDokumentasjonKnapp',
            title: 'Ettersend dokumentasjon knapp',
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
        })
    ],
})
