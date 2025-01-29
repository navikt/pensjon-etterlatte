import { HStack, VStack } from '@navikt/ds-react'
import { SideLaster } from '../../common/SideLaster.tsx'
import { useInnloggetInnbygger } from '../../common/innloggetInnbygger/InnloggetInnbyggerContext.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'
import { Alder, IInnloggetBruker } from '../../types/person.ts'
import { IkkeGyldigAlder } from '../components/ikkeGyldigAlder/IkkeGyldigAlder.tsx'
import { InntektsjusteringInntektTilNesteAar as InntektsjusteringInntektTilNesteAarInnhold } from '../sanity.types.ts'
import { finnAlder } from './finnAlder.ts'
import { AttenTilSekstiEnAarSkjema } from './skjemaer/AttenTilSekstiEnAarSkjema.tsx'
import { SekstiSyvAarSkjema } from './skjemaer/SekstiSyvAarSkjema.tsx'
import { SekstiToTilSekstiSeksAarSkjema } from './skjemaer/SekstiToTilSekstiSeksAarSkjema.tsx'

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
                    <VStack gap="6" maxWidth="36rem">
                        <SkjemaHeader aktivtSteg={2} stegLabelKey="steg2" skjemaNavn="inntektsjustering" />

                        {velgSkjemaForInntekt(finnAlder(innloggetBruker), innloggetBruker)}
                    </VStack>
                </HStack>
            </main>
        )
    )
}
