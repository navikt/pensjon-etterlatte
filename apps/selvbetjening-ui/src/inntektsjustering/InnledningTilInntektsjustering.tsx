import { Alert, Bleed, Button, GuidePanel, Heading, Hide, HStack, VStack } from '@navikt/ds-react'
import { ArrowRightIcon } from '@navikt/aksel-icons'
import { SkjemaProgresjon } from './components/SkjemaProgresjon.tsx'
import { VarigLoonnstilskuddIcon } from './icons/VarigLoonnstilskuddIcon.tsx'
import { Navigate, useNavigate } from 'react-router-dom'
import useSWR, { SWRResponse } from 'swr'
import { apiURL } from '../utils/api.ts'
import { SanityRikTekst } from '../common/sanity/SanityRikTekst.tsx'
import { SpraakVelger } from '../common/spraak/SpraakVelger.tsx'
import { useSpraak } from '../common/spraak/SpraakContext.tsx'

export const InnledningTilInntektsjustering = () => {
    const navigate = useNavigate()

    const spraak = useSpraak()

    const { data, error }: SWRResponse<never[], boolean, boolean> = useSWR(
        `${apiURL}/sanity?` + new URLSearchParams('sanityQuery=*[_type == "innledningTilInntektsjustering"]')
    )

    if (error) {
        return <Navigate to="/system-utilgjengelig" />
    }

    return (
        !!data?.length && (
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
                            {data[0]['tittel'][spraak]}
                        </Heading>
                    </HStack>

                    <SkjemaProgresjon aktivtSteg={1} valgtSpraak={spraak} />

                    <SanityRikTekst text={data[0]['hovedinnhold'][spraak]} />

                    <Alert variant="info">{data[0]['info'][spraak]}</Alert>
                    <Bleed marginInline={{ xs: '0', md: '10 0' }}>
                        <GuidePanel>
                            <SanityRikTekst text={data[0]['veiledning'][spraak]} />
                        </GuidePanel>
                    </Bleed>
                    <div>
                        <Button
                            icon={<ArrowRightIcon aria-hidden />}
                            iconPosition="right"
                            onClick={() => navigate('/inntektsjustering/opprett')}
                        >
                            Start utfyllingen
                        </Button>
                    </div>
                </VStack>
            </HStack>
        )
    )
}
