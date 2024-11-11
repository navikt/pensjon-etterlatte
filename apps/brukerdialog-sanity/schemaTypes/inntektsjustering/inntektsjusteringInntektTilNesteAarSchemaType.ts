import { defineField, defineType } from 'sanity'
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
            ],
        }),
    ],
})
