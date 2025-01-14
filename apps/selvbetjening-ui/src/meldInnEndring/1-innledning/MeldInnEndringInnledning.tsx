import { useNavigate } from 'react-router-dom'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { MeldInnEndringInnledning as MeldFraOmEndringInnledningInnhold } from '../sanity.types.ts'
import { SideLaster } from '../../common/SideLaster.tsx'
import { Button, HStack, VStack } from '@navikt/ds-react'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'
import { ArrowRightIcon } from '@navikt/aksel-icons'

export const MeldInnEndringInnledning = () => {
    const navigate = useNavigate()

    const spraak = useSpraak()

    const {
        innhold,
        error: innholdError,
        isLoading: innholdIsLoading,
    } = useSanityInnhold<MeldFraOmEndringInnledningInnhold>('*[_type == "meldInnEndringInnledning"]')

    if (innholdIsLoading) {
        return <SideLaster />
    }

    if (innholdError) {
        throw innholdError
    }

    return (
        !!innhold && (
            <main>
                <HStack justify="center" padding="8" minHeight="100vh">
                    <VStack gap="6" maxWidth="42.5rem">
                        <SkjemaHeader aktivtSteg={1} stegLabelKey="steg1" skjemaNavn="meld-inn-endring" />

                        <div>
                            <SanityRikTekst text={innhold.hovedinnhold?.[spraak]} />
                        </div>

                        <div>
                            <Button
                                icon={<ArrowRightIcon aria-hidden />}
                                iconPosition="right"
                                onClick={() => navigate('/meld-inn-endring/meld-fra-om-endring')}
                            >
                                {innhold.startUtfyllingKnapp?.[spraak]}
                            </Button>
                        </div>
                    </VStack>
                </HStack>
            </main>
        )
    )
}
