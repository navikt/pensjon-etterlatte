import { defineField, defineType } from 'sanity'
import { spraakBlockFields, spraakStringFields } from '../spraak'
import { errorVedTomInputSchemaField, textFieldSchemaFields } from '../inntektsjustering/skjemaer/fellesSchemaFields'

export const meldInnEndringMeldFraSchemaType = defineType({
    name: 'meldInnEndringMeldFra',
    title: '2 - Meld fra om endring',
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
            name: 'endring',
            title: 'Hvilken type endring',
            type: 'object',
            fields: [
                defineField({
                    name: 'legend',
                    title: 'Legend',
                    type: 'object',
                    fields: spraakStringFields,
                }),
                defineField({
                    name: 'description',
                    title: 'Description (valgfri)',
                    type: 'object',
                    fields: spraakStringFields,
                }),
                defineField({
                    name: 'radios',
                    title: 'Radios',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'aktivitetOgInntekt',
                            title: 'Aktivitet og inntekt',
                            type: 'object',
                            fields: [
                                defineField({
                                    name: 'label',
                                    title: 'Label',
                                    type: 'object',
                                    fields: spraakStringFields,
                                }),
                                defineField({
                                    name: 'description',
                                    title: 'Description (valgfri)',
                                    type: 'object',
                                    fields: spraakStringFields,
                                }),
                            ],
                        }),
                        defineField({
                            name: 'inntekt',
                            title: 'Inntekt',
                            type: 'object',
                            fields: [
                                defineField({
                                    name: 'label',
                                    title: 'Label',
                                    type: 'object',
                                    fields: spraakStringFields,
                                }),
                            ],
                        }),
                            defineField({
                                name: 'svarPaaEtteroppgjoer',
                                title: 'Svar på etteroppgjør',
                                type: 'object',
                                fields: [
                                    defineField({
                                        name: 'label',
                                        title: 'Label',
                                        type: 'object',
                                        fields: spraakStringFields,
                                    }),
                                ]
                            }),
                        defineField({
                            name: 'annet',
                            title: 'Annet',
                            type: 'object',
                            fields: [
                                defineField({
                                    name: 'label',
                                    title: 'Label',
                                    type: 'object',
                                    fields: spraakStringFields,
                                }),
                            ],
                        }),
                    ],
                }),
                errorVedTomInputSchemaField,
            ],
        }),
        defineField({
            name: 'informasjonOmEndring',
            title: 'Informasjon om endring',
            type: 'object',
            fields: [
                defineField({
                    name: 'aktivitetOgInntekt',
                    title: 'Aktivitet og inntekt',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'tittel',
                            title: 'Tittel',
                            type: 'object',
                            fields: spraakStringFields,
                        }),
                        defineField({
                            name: 'endringAccordion',
                            title: 'Accordion om endringer',
                            type: 'object',
                            fields: [
                                defineField({
                                    name: 'jobbItem',
                                    title: 'Jobb item',
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
                                            fields: spraakBlockFields,
                                        }),
                                    ],
                                }),
                                defineField({
                                    name: 'studierItem',
                                    title: 'Studier item',
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
                                            fields: spraakBlockFields,
                                        }),
                                    ],
                                }),
                                defineField({
                                    name: 'annenAktivitetItem',
                                    title: 'Annen aktivitet item',
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
                                            fields: spraakBlockFields,
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        defineField({
                            name: 'hovedinnhold',
                            title: 'Hovedinnhold',
                            type: 'object',
                            fields: spraakBlockFields,
                        }),
                    ],
                }),
                defineField({
                    name: 'inntekt',
                    title: 'Inntekt',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'tittel',
                            title: 'Tittel',
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
                            name: 'hvorforViSpoerOmInntektReadMore',
                            title: 'Hvorfor vi spør om inntekt read more',
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
                                    fields: spraakBlockFields,
                                }),
                            ],
                        }),
                        defineField({
                            name: 'svarPaaSpoersmaal',
                            title: 'Svar på spørsmål',
                            type: 'object',
                            fields: spraakBlockFields,
                        }),
                    ],
                }),
                defineField({
                    name: 'svarPaaEtteroppgjoer',
                    title: 'Svar på etteroppgjør',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'hovedinnhold',
                            title: 'Hovedinnhold',
                            type: 'object',
                            fields: spraakBlockFields,
                        })
                    ]
                }),
                defineField({
                    name: 'annet',
                    title: 'Annet',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'tittel',
                            title: 'Tittel',
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
                            name: 'endreKontaktEllerKontonummerAlert',
                            title: 'Alert for å endre kontakt eller kontonummer',
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
                                    fields: spraakBlockFields,
                                }),
                            ],
                        }),
                        defineField({
                            name: 'detViTrengerForAaBehandleEndring',
                            title: 'Det vi trenger for å behandle endring',
                            type: 'object',
                            fields: spraakBlockFields,
                        }),
                    ],
                }),
            ],
        }),
        defineField({
            name: 'beskrivelseAvEndring',
            title: 'Beskrivelse av endring',
            type: 'object',
            fields: [
                ...textFieldSchemaFields,
                defineField({
                    name: 'svarPaaEtteroppgjoerLabel',
                    title: 'Svar på etteroppgjør label',
                    type: 'object',
                    fields: spraakStringFields
                }),
                defineField({
                    name: 'svarPaaEtteroppgjoerDescription',
                    title: 'Svar på etteroppgjør description',
                    type: 'object',
                    fields: spraakStringFields
                }),
                errorVedTomInputSchemaField,
                defineField({
                    name: 'errorVedForMangeTegn',
                    title: 'Error ved for mange tegn',
                    type: 'object',
                    fields: spraakStringFields
                }),
                defineField({
                    name: 'tegnIgjen',
                    title: 'Tegn igjen',
                    type: 'object',
                    fields: spraakStringFields
                }),
                defineField({
                    name: 'forMangeTegn',
                    title: 'For mange tegn',
                    type: 'object',
                    fields: spraakStringFields
                })
            ],
        }),
        defineField({
            name: 'svarPaaEtteroppgjoerDokumentasjonInfoAlert',
            title: 'Svar på etteroppgjør dokumentasjon info alert',
            type: 'object',
            fields: spraakStringFields
        }),
    ],
})
