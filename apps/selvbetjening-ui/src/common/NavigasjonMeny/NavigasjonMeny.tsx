import { BodyShort, Box, Button, HGrid, VStack } from '@navikt/ds-react'
import { ArrowLeftIcon, ArrowRightIcon, FloppydiskIcon, PaperplaneIcon, TrashIcon } from '@navikt/aksel-icons'
import { Navigate, useNavigate } from 'react-router-dom'
import { useSpraak } from '../spraak/SpraakContext.tsx'
import { useSanityInnhold } from '../sanity/useSanityInnhold.ts'
import { FellesKomponenter } from '../../sanity.types.ts'
import { Inntekt } from '../../types/inntektsjustering.ts'

interface Props {
    tilbakePath: string
    nestePath: string
    skalSendeSoeknad?: boolean
    inntekt?: Inntekt
}

export const NavigasjonMeny = ({ tilbakePath, nestePath, skalSendeSoeknad, inntekt }: Props) => {
    const navigate = useNavigate()

    const spraak = useSpraak()

    const { innhold, error, isLoading } = useSanityInnhold<FellesKomponenter>('*[_type == "fellesKomponenter"]')

    if (error && !isLoading) return <Navigate to="/system-utilgjengelig" />

    return (
        !!innhold && (
            <VStack gap="4">
                <BodyShort as="div" size="small" textColor="subtle">
                    {innhold.navigasjonMeny?.sistLagret?.[spraak]}: 10. mars 2024 kl. 13.55
                </BodyShort>
                <HGrid gap={{ xs: '4', sm: '8 4' }} columns={{ xs: 1, sm: 2 }} width={{ sm: 'fit-content' }}>
                    <Button
                        variant="secondary"
                        icon={<ArrowLeftIcon aria-hidden />}
                        iconPosition="left"
                        onClick={() =>
                            navigate(`/inntektsjustering/${tilbakePath}`, { state: inntekt ? inntekt : undefined })
                        }
                    >
                        {innhold.navigasjonMeny?.knapper?.forrigeStegKnapp?.[spraak]}
                    </Button>
                    <Button
                        variant="primary"
                        icon={skalSendeSoeknad ? <PaperplaneIcon aria-hidden /> : <ArrowRightIcon aria-hidden />}
                        iconPosition="right"
                        onClick={() =>
                            navigate(`/inntektsjustering/${nestePath}`, { state: inntekt ? inntekt : undefined })
                        }
                    >
                        {skalSendeSoeknad
                            ? innhold.navigasjonMeny?.knapper?.sendSoeknadKnapp?.[spraak]
                            : innhold.navigasjonMeny?.knapper?.nesteStegKnapp?.[spraak]}
                    </Button>

                    <Box asChild marginBlock={{ xs: '4 0', sm: '0' }}>
                        <Button variant="tertiary" icon={<FloppydiskIcon aria-hidden />} iconPosition="left">
                            {innhold.navigasjonMeny?.knapper?.fortsettSenereKnapp?.[spraak]}
                        </Button>
                    </Box>
                    <Button variant="tertiary" icon={<TrashIcon aria-hidden />} iconPosition="left">
                        {innhold.navigasjonMeny?.knapper?.slettSoeknadenKnapp?.[spraak]}
                    </Button>
                </HGrid>
            </VStack>
        )
    )
}
