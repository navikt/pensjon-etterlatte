import { defineField, defineType } from 'sanity'
import { spraakBlockFields, spraakStringFields } from '../spraak'
import { sekstiToTilSekstiSeksAarSkjemaSchemaField } from './skjemaer/sekstiToTilSekstiSeksAarSkjemaSchemaField'
import { attenTilSekstiEnAarSkjemaSchemaField } from './skjemaer/attenTilSekstiEnAarSkjemaSchemaField'
import { sekstiSyvAarSkjemaSchemaField } from './skjemaer/sekstiSyvAarSkjemaSchemaField'

export const inntektsjusteringInntektTilNesteAarSchemaType = defineType({
    name: 'inntektsjusteringInntektTilNesteAar',
    title: '2 - Utfylling av inntekt til neste år',
    type: 'document',
    fields: [
        defineField({
            name: 'dokumentTittel',
            title: 'Dokument tittel',
            type: 'string',
        }),
        defineField({
            name: 'inntektSkjemaer',
            title: 'Inntekt skjemaer',
            type: 'object',
            fields: [
                attenTilSekstiEnAarSkjemaSchemaField,
                sekstiToTilSekstiSeksAarSkjemaSchemaField,
                sekstiSyvAarSkjemaSchemaField,
                defineField({
                    name: 'ikkeGyldigForAaMeldeInnInntekt',
                    title: 'Ikke gyldig for å melde inn inntekt',
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
            ],
        }),
    ],
})
