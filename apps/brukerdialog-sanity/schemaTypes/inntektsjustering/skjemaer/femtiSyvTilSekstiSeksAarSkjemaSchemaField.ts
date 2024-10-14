import { defineField } from 'sanity'
import { spraakBlockFields, spraakStringFields } from '../../spraak'
import { textFieldSchemaFields, valgfriReadMoreSchemaField } from './fellesSchemaFields'

const errorVedTomInputSchemaField = defineField({
    name: 'errorVedTomInput',
    title: 'Error ved tom input',
    type: 'object',
    fields: spraakStringFields,
})

export const femtiSyvTilSekstiSeksAarSkjemaSchemaField = defineField({
    name: 'femtiSyvTilSekstiSeksAarSkjema',
    title: '57 til 66 år',
    options: {
        collapsible: true,
        collapsed: false,
    },
    type: 'object',
    fields: [
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
            name: 'inntekterSomSkalMeldesReadMore',
            title: 'Inntekter du skal melde inn read more',
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
    ],
})
