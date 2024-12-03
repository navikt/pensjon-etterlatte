import { inntektsjusteringInnledningSchemaType } from './inntektsjusteringInnledningSchemaType'
import { fellesKomponenterSchemaType } from './fellesKomponenterSchemaType'
import { inntektsjusteringOppsummeringSchemaType } from './inntektsjusteringOppsummeringSchemaType'
import { inntektsjusteringKvitteringSchemaType } from './inntektsjusteringKvitteringSchemaType'
import { inntektsjusteringInntektTilNesteAarSchemaType } from './inntektsjusteringInntektTilNesteAarSchemaType'
import { ikkeGyldigForAaMeldeInntektSchemaType } from './IkkeGyldigForAaMeldeInntektSchemaType'
import { inntektSkjemaLukketSchemaType } from './inntektSkjemaLukket'

export const inntektsjusteringSchemaTypes = [
    inntektsjusteringInnledningSchemaType,
    inntektsjusteringInntektTilNesteAarSchemaType,
    inntektsjusteringOppsummeringSchemaType,
    inntektsjusteringKvitteringSchemaType,
    ikkeGyldigForAaMeldeInntektSchemaType,
    inntektSkjemaLukketSchemaType,
    fellesKomponenterSchemaType,
]
