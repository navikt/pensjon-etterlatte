import { Alert, Bleed, Button, GuidePanel, Heading, Hide, HStack, VStack } from '@navikt/ds-react'
import { ArrowRightIcon } from '@navikt/aksel-icons'
import { SkjemaProgresjon } from '../../common/SkjemaProgresjon.tsx'
import { VarigLoonnstilskuddIcon } from './icons/VarigLoonnstilskuddIcon.tsx'
import { Navigate, useNavigate } from 'react-router-dom'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'
import { SpraakVelger } from '../../common/spraak/SpraakVelger.tsx'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { InnledningTilInntektsjustering } from '../../sanity.types.ts'

export const InntektsjusteringInnledning = () => {
    const navigate = useNavigate()

    const spraak = useSpraak()

    const { innhold, error, isLoading } = useSanityInnhold<InnledningTilInntektsjustering>(
        '*[_type == "innledningTilInntektsjustering"]'
    )

    if (error && !isLoading) {
        return <Navigate to="/system-utilgjengelig" />
    }

    return (
        !!innhold && (
            <HStack justify="center" padding="8">
                <VStack gap="6" maxWidth="42.5rem">
                    <HStack justify="end">
                        <SpraakVelger />
                    </HStack>
                    <HStack gap="4" align="center">
                        <Hide below="md">
                            <VarigLoonnstilskuddIcon />
                        </Hide>
                        <Heading size="xlarge" level="1">
                            {innhold.tittel?.[spraak]}
                        </Heading>
                    </HStack>

                    <SkjemaProgresjon aktivtSteg={1} />

                    <SanityRikTekst text={innhold.hovedinnhold?.[spraak]} />

                    <Alert variant="info">{innhold.info?.[spraak]}</Alert>
                    <Bleed marginInline={{ xs: '0', md: '10 0' }}>
                        <GuidePanel>
                            <SanityRikTekst text={innhold.veiledning?.[spraak]} />
                        </GuidePanel>
                    </Bleed>
                    <div>
                        <Button
                            icon={<ArrowRightIcon aria-hidden />}
                            iconPosition="right"
                            onClick={() => navigate('/inntektsjustering/opprett')}
                        >
                            {innhold.startUtfyllingKnapp?.[spraak]}
                        </Button>
                    </div>
                </VStack>
            </HStack>
        )
    )
}
