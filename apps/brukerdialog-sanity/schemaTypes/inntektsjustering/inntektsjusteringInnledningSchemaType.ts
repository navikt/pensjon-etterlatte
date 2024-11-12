import { defineField, defineType } from 'sanity'
import { spraakBlockFields, spraakStringFields } from '../spraak'

export const inntektsjusteringInnledningSchemaType = defineType({
    name: 'inntektsjusteringInnledning',
    title: '1 - Innledning til inntektsjustering',
    type: 'document',
    fields: [
        defineField({
            name: 'dokumentTittel',
            title: 'Dokument tittel',
            type: 'string',
        }),
        defineField({
            name: 'hovedinnhold',
            title: 'Hovedinnhold',
            type: 'object',
            fields: spraakBlockFields,
        }),
        defineField({
            name: 'behandlingAvInformasjonAccordion',
            title: 'Accordion for hvordan vi behandler brukers informasjon',
            type: 'object',
            fields: [
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
            ],
        }),
        defineField({
            name: 'oppgittInntektAlert',
            title: 'Oppgitt inntekt alert',
            type: 'object',
            fields: [
                defineField({
                    name: 'tittel',
                    title: 'Tittel',
                    type: 'object',
                    fields: spraakStringFields,
                }),
                defineField({
                    name: 'innhold',
                    title: 'Innhold',
                    type: 'object',
                    fields: spraakStringFields,
                }),
                defineField({
                    name: 'inntektIkkeKorrekt',
                    title: 'Inntekt er ikke korrekt',
                    type: 'object',
                    fields: spraakStringFields,
                }),
            ],
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
            fields: [
                defineField({ name: 'tittel', title: 'Tittel', type: 'object', fields: spraakStringFields }),
                defineField({ name: 'innhold', title: 'Innhold', type: 'object', fields: spraakStringFields }),
            ],
        }),
        defineField({
            name: 'startUtfyllingKnapp',
            title: 'Start utfylling knapp',
            type: 'object',
            fields: spraakStringFields,
        }),
    ],
})
