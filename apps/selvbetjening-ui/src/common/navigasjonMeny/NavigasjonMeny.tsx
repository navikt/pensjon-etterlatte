import { ArrowLeftIcon, ArrowRightIcon, PaperplaneIcon } from '@navikt/aksel-icons'
import { Button, HGrid, VStack } from '@navikt/ds-react'
import { useNavigate } from 'react-router-dom'
import { useSanityInnhold } from '../sanity/useSanityInnhold.ts'
import { NavigasjonsMeny as NavigasjonsMenyInnhold } from '../sanity.types.ts'
import { useSpraak } from '../spraak/SpraakContext.tsx'

interface Props {
    tilbakePath: string
    skalSendeInnSkjema?: boolean
    onNeste?: () => void
    nesteLaster?: boolean
}

export const NavigasjonMeny = ({ tilbakePath, skalSendeInnSkjema, onNeste, nesteLaster }: Props) => {
    const navigate = useNavigate()

    const spraak = useSpraak()

    const { innhold, innholdError, innholdIsLoading } =
        useSanityInnhold<NavigasjonsMenyInnhold>('*[_type == "navigasjonMeny"]')

    if (innholdError && !innholdIsLoading) throw innholdError

    return (
        !!innhold && (
            <VStack gap="4">
                <HGrid gap={{ xs: '4', sm: '8 4' }} columns={{ xs: 1, sm: 2 }} width={{ sm: 'fit-content' }}>
                    <Button
                        type="button"
                        variant="secondary"
                        icon={<ArrowLeftIcon aria-hidden />}
                        iconPosition="left"
                        onClick={() => navigate(tilbakePath)}
                    >
                        {innhold.forrigeStegKnapp?.[spraak]}
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        icon={skalSendeInnSkjema ? <PaperplaneIcon aria-hidden /> : <ArrowRightIcon aria-hidden />}
                        iconPosition="right"
                        onClick={onNeste}
                        loading={nesteLaster}
                    >
                        {skalSendeInnSkjema ? innhold.sendTilNavKnapp?.[spraak] : innhold.nesteStegKnapp?.[spraak]}
                    </Button>
                </HGrid>
            </VStack>
        )
    )
}
