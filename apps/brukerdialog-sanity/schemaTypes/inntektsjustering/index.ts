import { inntektsjusteringInnledningSchemaType } from './inntektsjusteringInnledningSchemaType'
import { fellesKomponenterSchemaType } from './fellesKomponenterSchemaType'
import { inntektsjusteringOppsummeringSchemaType } from './inntektsjusteringOppsummeringSchemaType'
import { inntektsjusteringKvitteringSchemaType } from './inntektsjusteringKvitteringSchemaType'
import { inntektsjusteringInntektTilNesteAarSchemaType } from './inntektsjusteringInntektTilNesteAarSchemaType'
import { ikkeGyldigForAaMeldeInntektSchemaType } from './IkkeGyldigForAaMeldeInntektSchemaType'

export const inntektsjusteringSchemaTypes = [
    inntektsjusteringInnledningSchemaType,
    inntektsjusteringInntektTilNesteAarSchemaType,
    inntektsjusteringOppsummeringSchemaType,
    inntektsjusteringKvitteringSchemaType,
    ikkeGyldigForAaMeldeInntektSchemaType,
    fellesKomponenterSchemaType,
]
