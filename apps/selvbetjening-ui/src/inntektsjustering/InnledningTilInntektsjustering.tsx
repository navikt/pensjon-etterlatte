import { Alert, Bleed, Button, GuidePanel, Heading, Hide, HStack, VStack } from '@navikt/ds-react'
import { ArrowRightIcon } from '@navikt/aksel-icons'
import { SkjemaProgresjon } from './components/SkjemaProgresjon.tsx'
import { VarigLoonnstilskuddIcon } from './icons/VarigLoonnstilskuddIcon.tsx'
import { useNavigate } from 'react-router-dom'
import useSWR, { SWRResponse } from 'swr'
import { apiURL } from '../utils/api.ts'
import { SanityRikTekst } from '../common/sanity/SanityRikTekst.tsx'

export const InnledningTilInntektsjustering = () => {
    const navigate = useNavigate()

    const { data, error }: SWRResponse<never[], boolean, boolean> = useSWR(
        `${apiURL}/sanity?` + new URLSearchParams('sanityQuery=*[_type == "innledningTilInntektsjustering"]')
    )

    if (error) navigate('/system-utilgjengelig')

    return (
        !!data?.length && (
            <HStack justify="center" padding="8">
                <VStack gap="6" maxWidth="42.5rem">
                    <HStack gap="4" align="center">
                        <Hide below="md">
                            <VarigLoonnstilskuddIcon />
                        </Hide>
                        <Heading size="xlarge" level="1">
                            {data[0]['tittel']['NB']}
                        </Heading>
                    </HStack>

                    <SkjemaProgresjon aktivtSteg={1} />

                    <SanityRikTekst text={data[0]['hovedinnhold']['NB']} />

                    <Alert variant="info">{data[0]['info']['NB']}</Alert>
                    <Bleed marginInline={{ xs: '0', md: '10 0' }}>
                        <GuidePanel>
                            <SanityRikTekst text={data[0]['veiledning']['NB']} />
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
