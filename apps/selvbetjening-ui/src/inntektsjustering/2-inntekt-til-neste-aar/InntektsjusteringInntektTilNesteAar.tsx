import { HStack, VStack } from '@navikt/ds-react'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'
import { InntektsjusteringInntektTilNesteAar as InntektsjusteringInntektTilNesteAarInnhold } from '../../sanity.types.ts'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { Navigate } from 'react-router-dom'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'
import { Alder } from '../../types/person.ts'
import { AttenTilFemtiSeksAarSkjema } from './skjemaer/AttenTilFemtiSeksAarSkjema.tsx'
import { finnAlder } from './finnAlder.ts'
import { FemtiSyvTilSekstiSeksAarSkjema } from './skjemaer/FemtiSyvTilSekstiSeksAarSkjema.tsx'
import { useInnloggetInnbygger } from '../../common/innloggetInnbygger/InnloggetInnbyggerContext.tsx'

export const InntektsjusteringInntektTilNesteAar = () => {
    const spraak = useSpraak()

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
        }
    }

    return (
        !!innloggetBruker &&
        !!innhold && (
            <main>
                <HStack justify="center" padding="8">
                    <VStack gap="6" maxWidth="42.5rem">
                        <SkjemaHeader aktivtSteg={2} stegLabelKey="steg2" />

                        <div>
                            <SanityRikTekst text={innhold.hovedinnhold?.[spraak]} />
                        </div>

                        {/* TODO: bruker hardkodet person helt til vi har dette på plass i backend */}
                        {velgSkjemaForInntekt(finnAlder(innloggetBruker))}
                    </VStack>
                </HStack>
            </main>
        )
    )
}
