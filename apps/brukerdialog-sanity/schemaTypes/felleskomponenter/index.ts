import { fantIkkeSidenSchemaType } from './fantIkkeSidenSchemaType'
import { systemUtilgjengeligSchemaType } from './systemUtilgjengeligSchemaType'
import { spraakVelgerSchemaType } from './spraakVelgerSchemaType'
import { skjemaHeaderSchemaType } from './skjemaHeaderSchemaType'
import { navigasjonMenySchemaType } from './navigasjonMenySchemaType'
import { sammendragAvSkjemaFeilSchemaType } from './sammendragAvSkjemaFeilSchemaType'
import { harIkkeOMSSakIGjennySchemaType } from './harIkkeOMSSakIGjennySchemaType'
import { textareaSchemaType } from './textareaSchemaType'

export const felleskomponenterSchemaType = [
    spraakVelgerSchemaType,
    skjemaHeaderSchemaType,
    sammendragAvSkjemaFeilSchemaType,
    navigasjonMenySchemaType,
    textareaSchemaType,
    harIkkeOMSSakIGjennySchemaType,
    fantIkkeSidenSchemaType,
    systemUtilgjengeligSchemaType,
]
