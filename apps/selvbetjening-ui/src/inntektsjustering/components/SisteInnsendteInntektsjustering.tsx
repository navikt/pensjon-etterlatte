import useSWR, { SWRResponse } from 'swr'
import { IInntektsjustering } from '../../types/inntektsjustering.ts'
import { BodyShort, Box, Button, Heading, Skeleton, VStack } from '@navikt/ds-react'
import { useNavigate } from 'react-router-dom'

export const SisteInnsendteInntektsjustering = () => {
    const navigate = useNavigate()

    const { data, isLoading, error }: SWRResponse<IInntektsjustering, boolean, boolean> =
        useSWR(`/api/inntektsjustering`)

    return (
        <div>
            <Heading size="large" spacing>
                Dette har du oppgitt tidligere
            </Heading>
            {isLoading ? (
                <Skeleton />
            ) : !!data && !error ? (
                <div></div>
            ) : (
                <Box
                    minWidth="fit-content"
                    maxWidth="30rem"
                    padding="8"
                    background="surface-subtle"
                    borderRadius="large"
                >
                    <Heading size="small" spacing>
                        Tidligere oppgitt inntekt for neste år
                    </Heading>
                    <VStack gap="4">
                        <BodyShort>Ingen inntekt for neste år er oppgitt</BodyShort>
                        <div>
                            <Button variant="secondary" onClick={() => navigate('/inntektsjustering/opprett')}>
                                Oppgi inntekt
                            </Button>
                        </div>
                    </VStack>
                </Box>
            )}
        </div>
    )
}
