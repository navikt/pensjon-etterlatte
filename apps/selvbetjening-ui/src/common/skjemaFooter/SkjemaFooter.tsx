import { BodyShort, Box, Button, HGrid, VStack } from '@navikt/ds-react'
import { ArrowLeftIcon, ArrowRightIcon, FloppydiskIcon, PaperplaneIcon, TrashIcon } from '@navikt/aksel-icons'
import { useNavigate } from 'react-router-dom'

interface Props {
    tilbakePath: string
    nestePath: string
    skalSendeSoeknad?: boolean
}

export const SkjemaFooter = ({ tilbakePath, nestePath, skalSendeSoeknad }: Props) => {
    const navigate = useNavigate()

    return (
        <VStack gap="4">
            <BodyShort as="div" size="small" textColor="subtle">
                Sist lagret: 10. mars 2024 kl. 13.55
            </BodyShort>
            <HGrid gap={{ xs: '4', sm: '8 4' }} columns={{ xs: 1, sm: 2 }} width={{ sm: 'fit-content' }}>
                <Button
                    variant="secondary"
                    icon={<ArrowLeftIcon aria-hidden />}
                    iconPosition="left"
                    onClick={() => navigate(`/inntektsjustering/${tilbakePath}`)}
                >
                    Forrige steg
                </Button>
                <Button
                    variant="primary"
                    icon={skalSendeSoeknad ? <PaperplaneIcon aria-hidden /> : <ArrowRightIcon aria-hidden />}
                    iconPosition="right"
                    onClick={() => navigate(`/inntektsjustering/${nestePath}`)}
                >
                    {skalSendeSoeknad ? 'Send søknad' : 'Neste steg'}
                </Button>

                <Box asChild marginBlock={{ xs: '4 0', sm: '0' }}>
                    <Button variant="tertiary" icon={<FloppydiskIcon aria-hidden />} iconPosition="left">
                        Fortsett senere
                    </Button>
                </Box>
                <Button variant="tertiary" icon={<TrashIcon aria-hidden />} iconPosition="left">
                    Slett søknaden
                </Button>
            </HGrid>
        </VStack>
    )
}
