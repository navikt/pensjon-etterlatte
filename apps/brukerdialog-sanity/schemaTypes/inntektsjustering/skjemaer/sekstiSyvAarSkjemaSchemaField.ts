import { defineField } from 'sanity'
import { spraakBlockFields, spraakStringFields } from '../../spraak'
import { errorVedTomInputSchemaField, textFieldSchemaFields, valgfriReadMoreSchemaField } from './fellesSchemaFields'

export const sekstiSyvAarSkjemaSchemaField = defineField({
    name: 'sekstiSyvAarSkjema',
    title: '67 år',
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
            title: 'Skal du gå av med alderspensjon før du fyller 67? ',
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
            name: 'inntekterSomSkalMeldesInn',
            title: 'Inntekter du skal melde inn',
            type: 'object',
            fields: spraakBlockFields,
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
            name: 'AFPInntekt',
            title: 'AFP offentlig eller privat',
            type: 'object',
            fields: textFieldSchemaFields,
        }),
        defineField({
            name: 'AFPTjenestepensjonordning',
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