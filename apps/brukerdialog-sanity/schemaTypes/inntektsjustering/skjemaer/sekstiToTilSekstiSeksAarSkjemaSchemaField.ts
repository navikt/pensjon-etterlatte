import { defineField } from 'sanity'
import { spraakBlockFields, spraakStringFields } from '../../spraak'
import { errorVedTomInputSchemaField, textFieldSchemaFields, valgfriReadMoreSchemaField } from './fellesSchemaFields'

export const sekstiToTilSekstiSeksAarSkjemaSchemaField = defineField({
    name: 'sekstiToTilSekstiSeksAarSkjema',
    title: '62 til 66 år',
    options: {
        collapsible: true,
        collapsed: false,
    },
    type: 'object',
    fields: [
        defineField({
            name: 'hovedinnhold',
            title: 'Hovedinnhold',
            type: 'object',
            fields: spraakBlockFields,
        }),
        defineField({
            name: 'skalGaaAvMedAlderspensjon',
            title: 'Skal du gå av med alderspensjon til neste år? ',
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
                            name: 'ja',
                            title: 'Ja',
                            type: 'object',
                            fields: spraakStringFields,
                        }),
                        defineField({
                            name: 'nei',
                            title: 'Nei',
                            type: 'object',
                            fields: spraakStringFields,
                        }),
                        defineField({
                            name: 'vetIkke',
                            title: 'Vet ikke',
                            type: 'object',
                            fields: spraakStringFields,
                        }),
                    ],
                }),
                errorVedTomInputSchemaField,
                valgfriReadMoreSchemaField,
            ],
        }),
        defineField({
            name: 'datoForAaGaaAvMedAlderspensjon',
            title: 'Dato for å gå av med alderspensjon',
            type: 'object',
            fields: [...textFieldSchemaFields, errorVedTomInputSchemaField],
        }),
        defineField({
            name: 'omsTarSlutt',
            title: 'Omstillingsstønaden din vil ta slutt',
            type: 'object',
            fields: spraakBlockFields,
        }),
        defineField({
            name: 'inntekterSomSkalMeldesInn',
            title: 'Inntekter du skal melde inn',
            type: 'object',
            fields: [
                defineField({
                    name: 'skalGaaAvMedAlderspensjon',
                    title: 'Skal gå av med alderspensjon',
                    type: 'object',
                    fields: [
                        defineField({ name: 'ja', title: 'Ja', type: 'object', fields: spraakBlockFields }),
                        defineField({
                            name: 'neiVetIkke',
                            title: 'Nei / Vet ikke',
                            type: 'object',
                            fields: spraakBlockFields,
                        }),
                    ],
                }),
            ],
        }),
        defineField({
            name: 'arbeidsinntekt',
            title: 'Arbeidsinntekt og andre utbetalinger',
            type: 'object',
            fields: textFieldSchemaFields,
        }),
        defineField({
            name: 'naeringsinntekt',
            title: 'Næringsinntekt',
            type: 'object',
            fields: textFieldSchemaFields,
        }),
        defineField({
            name: 'afpInntekt',
            title: 'AFP offentlig eller privat',
            type: 'object',
            fields: [
                defineField({
                    name: 'label',
                    title: 'Tittel',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'afpOffentligEllerPrivat',
                            title: 'AFP offentlig eller privat',
                            type: 'object',
                            fields: spraakStringFields,
                        }),
                        defineField({
                            name: 'afpPrivat',
                            title: 'AFP privat',
                            type: 'object',
                            fields: spraakStringFields,
                        }),
                    ],
                }),
                defineField({
                    name: 'description',
                    title: 'Description (valgfri)',
                    type: 'object',
                    fields: spraakStringFields,
                }),
                valgfriReadMoreSchemaField,
            ],
        }),
        defineField({
            name: 'afpTjenestepensjonordning',
            title: 'AFP tjenestepensjonordning',
            type: 'object',
            fields: [...textFieldSchemaFields, errorVedTomInputSchemaField],
        }),
        defineField({
            name: 'inntektFraUtland',
            title: 'Alle inntekter fra utland',
            type: 'object',
            fields: textFieldSchemaFields,
        }),
        defineField({
            name: 'sumAvInntekt',
            title: 'Sum av inntekt',
            type: 'object',
            fields: [
                defineField({
                    name: 'skalGaaAvMedAlderspensjon',
                    title: 'Skal gå av med alderspensjon?',
                    type: 'object',
                    fields: [
                        defineField({ name: 'ja', title: 'Ja', type: 'object', fields: spraakBlockFields }),
                        defineField({
                            name: 'neiVetIkke',
                            title: 'Nei / Vet ikke',
                            type: 'object',
                            fields: spraakBlockFields,
                        }),
                    ],
                }),
            ],
        }),
    ],
})
