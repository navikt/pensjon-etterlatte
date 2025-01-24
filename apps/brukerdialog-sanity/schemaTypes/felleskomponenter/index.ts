import { fantIkkeSidenSchemaType } from './fantIkkeSidenSchemaType'
import { systemUtilgjengeligSchemaType } from './systemUtilgjengeligSchemaType'
import { spraakVelgerSchemaType } from './spraakVelgerSchemaType'
import { skjemaHeaderSchemaType } from './skjemaHeaderSchemaType'
import { navigasjonMenySchemaType } from './navigasjonMenySchemaType'
import { sammendragAvSkjemaFeilSchemaType } from './sammendragAvSkjemaFeilSchemaType'

export const felleskomponenterSchemaType = [
    spraakVelgerSchemaType,
    skjemaHeaderSchemaType,
    sammendragAvSkjemaFeilSchemaType,
    navigasjonMenySchemaType,
    fantIkkeSidenSchemaType,
    systemUtilgjengeligSchemaType,
]
