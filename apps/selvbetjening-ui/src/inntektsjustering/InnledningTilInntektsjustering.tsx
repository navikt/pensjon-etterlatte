import { Alert, Bleed, Button, GuidePanel, Heading, Hide, HStack, VStack } from '@navikt/ds-react'
import { ArrowRightIcon } from '@navikt/aksel-icons'
import { SkjemaProgresjon } from './components/SkjemaProgresjon.tsx'
import { VarigLoonnstilskuddIcon } from './icons/VarigLoonnstilskuddIcon.tsx'
import { Navigate, useNavigate } from 'react-router-dom'
import useSWR, { SWRResponse } from 'swr'
import { apiURL } from '../utils/api.ts'
import { SanityRikTekst } from '../common/sanity/SanityRikTekst.tsx'
import { useState } from 'react'
import { Spraak } from '../common/spraak/spraak.ts'
import { SpraakVelger } from '../common/spraak/SpraakVelger.tsx'

export const InnledningTilInntektsjustering = () => {
    const navigate = useNavigate()

    const [valgtSpraak] = useState<Spraak>(Spraak.BOKMAAL)

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
                            {data[0]['tittel'][valgtSpraak]}
                        </Heading>
                    </HStack>

                    <SkjemaProgresjon aktivtSteg={1} valgtSpraak={valgtSpraak} />

                    <SanityRikTekst text={data[0]['hovedinnhold'][valgtSpraak]} />

                    <Alert variant="info">{data[0]['info'][valgtSpraak]}</Alert>
                    <Bleed marginInline={{ xs: '0', md: '10 0' }}>
                        <GuidePanel>
                            <SanityRikTekst text={data[0]['veiledning'][valgtSpraak]} />
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
