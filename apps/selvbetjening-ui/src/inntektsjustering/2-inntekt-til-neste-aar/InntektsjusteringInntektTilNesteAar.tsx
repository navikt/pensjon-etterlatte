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

export const InntektsjusteringInntektTilNesteAar = () => {
    const spraak = useSpraak()

    const {
        innhold,
        error: innholdError,
        isLoading: innholdIsLoading,
    } = useSanityInnhold<InntektsjusteringInntektTilNesteAarInnhold>(
        '*[_type == "inntektsjusteringInntektTilNesteAar"]'
    )

    if (innholdError && !innholdIsLoading) {
        return <Navigate to="/system-utilgjengelig" />
    }

    const velgSkjemaForInntekt = (alder: Alder) => {
        switch (alder) {
            case Alder.ATTEN_TIL_FEMTI_SEKS:
                return <AttenTilFemtiSeksAarSkjema />
        }
    }

    return (
        !!innhold && (
            <main>
                <HStack justify="center" padding="8">
                    <VStack gap="6" maxWidth="42.5rem">
                        <SkjemaHeader aktivtSteg={2} stegLabelKey="steg2" />
                        <div>
                            <SanityRikTekst text={innhold.hovedinnhold?.[spraak]} />
                        </div>

                        {/* TODO: bruker hardkodet person helt til vi har dette på plass i backend */}
                        {velgSkjemaForInntekt(finnAlder({ foedselsdato: new Date(1975, 4, 11) }))}
                    </VStack>
                </HStack>
            </main>
        )
    )
}
