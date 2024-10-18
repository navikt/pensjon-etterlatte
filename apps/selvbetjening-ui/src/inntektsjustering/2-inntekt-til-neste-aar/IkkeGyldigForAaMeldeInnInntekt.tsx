import { Button, VStack } from '@navikt/ds-react'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { InntektsjusteringInntektTilNesteAar as InntektsjusteringInntektTilNesteAarInnhold } from '../../sanity.types.ts'
import { Navigate } from 'react-router-dom'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { ArrowRightIcon } from '@navikt/aksel-icons'

export const IkkeGyldigForAaMeldeInnInntekt = () => {
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

    return (
        !!innhold && (
            <VStack gap="6">
                <div>
                    <SanityRikTekst text={innhold.inntektSkjemaer?.ikkeGyldigForAaMeldeInnInntekt?.innhold?.[spraak]} />
                </div>
                <div>
                    <Button
                        as="a"
                        variant="primary"
                        icon={<ArrowRightIcon aria-hidden />}
                        iconPosition="right"
                        rel="noopener noreferrer"
                        href={innhold.inntektSkjemaer?.ikkeGyldigForAaMeldeInnInntekt?.gaaTilNAVKnapp?.lenke?.[spraak]}
                    >
                        {innhold.inntektSkjemaer?.ikkeGyldigForAaMeldeInnInntekt?.gaaTilNAVKnapp?.tekst?.[spraak]}
                    </Button>
                </div>
            </VStack>
        )
    )
}
