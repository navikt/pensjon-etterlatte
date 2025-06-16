import { defineField, defineType } from 'sanity'
import { spraakBlockFields, spraakStringFields } from '../spraak'

export const behandlingAvInformasjonAccordionSchemaType = defineType({
    name: 'behandlingAvInformasjonAccordion',
    title: 'Accordion for hvordan vi behandler brukers informasjon',
    type: 'document',
    fields: [
        defineField({
            name: 'dokumentTittel',
            title: 'Dokument tittel',
            type: 'string',
        }),
        defineField({
            name: 'informasjonViHenterItem',
            title: 'Informasjon vi henter item',
            type: 'object',
            fields: [
                defineField({
                    name: 'tittel',
                    title: 'Tittel',
                    type: 'object',
                    fields: spraakStringFields,
                }),
                defineField({ name: 'innhold', title: 'Innhold', type: 'object', fields: spraakBlockFields }),
            ],
        }),
        defineField({
            name: 'hvordanViBehandlerPersonopplysningerItem',
            title: 'Hvordan vi behandler personopplysninger item',
            type: 'object',
            fields: [
                defineField({
                    name: 'tittel',
                    title: 'Tittel',
                    type: 'object',
                    fields: spraakStringFields,
                }),
                defineField({ name: 'innhold', title: 'Innhold', type: 'object', fields: spraakBlockFields }),
                defineField({
                    name: 'hvordanNavBehandlerPersonopplysningerSetning',
                    title: 'Setning for hvordan Nav behandler personopplysninger',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'setningStart',
                            title: 'Setning start',
                            type: 'object',
                            fields: spraakStringFields,
                        }),
                        defineField({
                            name: 'lenkeTilNav',
                            title: 'Lenke til nav',
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
            ],
        }),
    ]
})