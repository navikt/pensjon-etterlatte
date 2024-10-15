import { defineField, defineType } from 'sanity'
import { spraakBlockFields, spraakStringFields } from '../spraak'
import { femtiSyvTilSekstiSeksAarSkjemaSchemaField } from './skjemaer/femtiSyvTilSekstiSeksAarSkjemaSchemaField'
import { attenTilFemtiSeksAarSkjemaSchemaField } from './skjemaer/attenTilFemtiSeksAarSkjemaSchemaField'

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
            name: 'hovedinnhold',
            title: 'Hovedinnhold',
            type: 'object',
            fields: spraakBlockFields,
        }),
        defineField({
            name: 'inntektSkjemaer',
            title: 'Inntekt skjemaer',
            type: 'object',
            fields: [attenTilFemtiSeksAarSkjemaSchemaField, femtiSyvTilSekstiSeksAarSkjemaSchemaField],
        }),
    ],
})
