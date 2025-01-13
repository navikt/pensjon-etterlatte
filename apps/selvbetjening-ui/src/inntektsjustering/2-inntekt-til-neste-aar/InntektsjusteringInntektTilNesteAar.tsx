import { HStack, VStack } from '@navikt/ds-react'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'
import { InntektsjusteringInntektTilNesteAar as InntektsjusteringInntektTilNesteAarInnhold } from '../sanity.types.ts'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { Alder, IInnloggetBruker } from '../../types/person.ts'
import { AttenTilSekstiEnAarSkjema } from './skjemaer/AttenTilSekstiEnAarSkjema.tsx'
import { finnAlder } from './finnAlder.ts'
import { SekstiToTilSekstiSeksAarSkjema } from './skjemaer/SekstiToTilSekstiSeksAarSkjema.tsx'
import { useInnloggetInnbygger } from '../../common/innloggetInnbygger/InnloggetInnbyggerContext.tsx'
import { SekstiSyvAarSkjema } from './skjemaer/SekstiSyvAarSkjema.tsx'
import { IkkeGyldigAlder } from '../components/ikkeGyldigAlder/IkkeGyldigAlder.tsx'
import { SideLaster } from '../../common/SideLaster.tsx'

export const InntektsjusteringInntektTilNesteAar = () => {
    const {
        data: innloggetBruker,
        error: innloggetBrukerError,
        isLoading: innloggetBrukerIsLoading,
    } = useInnloggetInnbygger()

    const {
        innhold,
        error: innholdError,
        isLoading: innholdIsLoading,
    } = useSanityInnhold<InntektsjusteringInntektTilNesteAarInnhold>(
        '*[_type == "inntektsjusteringInntektTilNesteAar"]'
    )

    if (innloggetBrukerIsLoading || innholdIsLoading) {
        return <SideLaster />
    }

    if (innholdError || innloggetBrukerError) {
        throw innloggetBrukerError || innholdError
    }

    const velgSkjemaForInntekt = (alder: Alder, bruker: IInnloggetBruker) => {
        switch (alder) {
            case Alder.ATTEN_TIL_SEKSTI_EN:
                return <AttenTilSekstiEnAarSkjema />
            case Alder.SEKSTI_TO_TIL_SEKSTI_SEKS:
                return <SekstiToTilSekstiSeksAarSkjema innloggetBruker={bruker} />
            case Alder.SEKSTI_SYV:
                return <SekstiSyvAarSkjema />
            case Alder.IKKE_GYLDIG:
                return <IkkeGyldigAlder />
        }
    }

    return (
        !!innloggetBruker &&
        !!innhold && (
            <main>
                <HStack justify="center" padding="8" minHeight="100vh">
                    <VStack gap="6" maxWidth="42.5rem">
                        <SkjemaHeader aktivtSteg={2} stegLabelKey="steg2" skjemaNavn="inntektsjustering" />

                        {velgSkjemaForInntekt(finnAlder(innloggetBruker), innloggetBruker)}
                    </VStack>
                </HStack>
            </main>
        )
    )
}
