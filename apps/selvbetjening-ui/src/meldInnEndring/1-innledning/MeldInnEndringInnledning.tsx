import { ArrowRightIcon } from '@navikt/aksel-icons'
import { Bleed, Button, GuidePanel, Heading, HStack, VStack } from '@navikt/ds-react'
import { useNavigate } from 'react-router-dom'
import { BehandlingAvInformasjonAccordion } from '../../common/behandlingAvInformasjonAccordion/BehandlingAvInformasjonAccordion.tsx'
import { SideLaster } from '../../common/SideLaster.tsx'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { MeldInnEndringInnledning as MeldFraOmEndringInnledningInnhold } from '../sanity.types.ts'

export const MeldInnEndringInnledning = () => {
    const navigate = useNavigate()

    const spraak = useSpraak()

    const {
        innhold,
        innholdError: innholdError,
        innholdIsLoading: innholdIsLoading,
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
                    <VStack gap="6" maxWidth="36rem">
                        <SkjemaHeader aktivtSteg={1} stegLabelKey="steg1" skjemaNavn="meld-inn-endring" />

                        <Heading size="medium" level="3">
                            {innhold.tittel?.[spraak]}
                        </Heading>

                        <Bleed marginInline={{ xs: '0', md: '10 0' }}>
                            <GuidePanel>
                                <SanityRikTekst text={innhold.veiledning?.[spraak]} />
                            </GuidePanel>
                        </Bleed>

                        <BehandlingAvInformasjonAccordion />

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
