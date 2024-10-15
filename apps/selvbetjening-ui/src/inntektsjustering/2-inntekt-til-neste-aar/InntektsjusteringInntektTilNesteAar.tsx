import { Heading, HStack, VStack } from '@navikt/ds-react'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'
import { InntektsjusteringInntektTilNesteAar as InntektsjusteringInntektTilNesteAarInnhold } from '../../sanity.types.ts'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { Navigate } from 'react-router-dom'
import { Alder } from '../../types/person.ts'
import { AttenTilFemtiSeksAarSkjema } from './skjemaer/AttenTilFemtiSeksAarSkjema.tsx'
import { finnAlder } from './finnAlder.ts'
import { FemtiSyvTilSekstiSeksAarSkjema } from './skjemaer/FemtiSyvTilSekstiSeksAarSkjema.tsx'
import { useInnloggetInnbygger } from '../../common/innloggetInnbygger/InnloggetInnbyggerContext.tsx'
import { SekstiSyvAarSkjema } from './skjemaer/SekstiSyvAarSkjema.tsx'

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

    if (innloggetBrukerError && !innloggetBrukerIsLoading) {
        return <Navigate to="/system-utilgjengelig" />
    }

    if (innholdError && !innholdIsLoading) {
        return <Navigate to="/system-utilgjengelig" />
    }

    const velgSkjemaForInntekt = (alder: Alder) => {
        switch (alder) {
            case Alder.ATTEN_TIL_FEMTI_SEKS:
                return <AttenTilFemtiSeksAarSkjema />
            case Alder.FEMTI_SYV_TIL_SEKSTI_SEKS:
                return <FemtiSyvTilSekstiSeksAarSkjema />
            case Alder.SEKSTI_SYV:
                return <SekstiSyvAarSkjema />
            case Alder.IKKE_GYLDIG:
                return <Heading size="large">Du er enten for ung eller for gammal til å kunne melde inntekt</Heading>
        }
    }

    return (
        !!innloggetBruker &&
        !!innhold && (
            <main>
                <HStack justify="center" padding="8">
                    <VStack gap="6" maxWidth="42.5rem">
                        <SkjemaHeader aktivtSteg={2} stegLabelKey="steg2" />

                        {velgSkjemaForInntekt(finnAlder(innloggetBruker))}
                    </VStack>
                </HStack>
            </main>
        )
    )
}
