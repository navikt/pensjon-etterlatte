import { useInnloggetInnbygger } from '../../../common/innloggetInnbygger/InnloggetInnbyggerContext.tsx'
import { KomponentLaster } from '../../../common/KomponentLaster.tsx'
import { Alder } from '../../../types/person.ts'
import { finnAlder } from './finnAlder.ts'
import { AttenTilSekstiEnAarSkjema } from './skjemaer/AttenTilSekstiEnAarSkjema.tsx'
import { IkkeGyldigAlder } from './skjemaer/IkkeGyldigAlder.tsx'
import { SekstiSyvAarSkjema } from './skjemaer/SekstiSyvAarSkjema.tsx'
import { SekstiToTilSekstiSeksAarSkjema } from './skjemaer/SekstiToTilSekstiSeksAarSkjema.tsx'

export const ForventetInntektTIlNesteAar = () => {
    const {
        data: innloggetBruker,
        error: innloggetBrukerError,
        isLoading: innloggetBrukerIsLoading,
    } = useInnloggetInnbygger()

    if (innloggetBrukerIsLoading) {
        return <KomponentLaster />
    }

    if (innloggetBrukerError) {
        throw innloggetBrukerError
    }

    const velgSkjemaForInntekt = (alder: Alder) => {
        switch (alder) {
            case Alder.ATTEN_TIL_SEKSTI_EN:
                return <AttenTilSekstiEnAarSkjema />
            case Alder.SEKSTI_TO_TIL_SEKSTI_SEKS:
                return <SekstiToTilSekstiSeksAarSkjema />
            case Alder.SEKSTI_SYV:
                return <SekstiSyvAarSkjema />
            case Alder.IKKE_GYLDIG:
                return <IkkeGyldigAlder />
        }
    }

    return !!innloggetBruker && velgSkjemaForInntekt(finnAlder(innloggetBruker))
}
