import { BodyShort, Box, Button, Heading, HStack, Select, Textarea, VStack } from '@navikt/ds-react'
import { SpraakVelger } from '../../common/spraak/SpraakVelger.tsx'
import { PaperplaneIcon } from '@navikt/aksel-icons'

enum EndringerAaMeldeInn {
    INNTEKT = 'Inntekt',
    AKTIVITET = 'Aktivitet',
}

export const MeldInnEndringSkjema = () => {
    return (
        <main>
            <HStack justify="center" padding="8" minHeight="100vh">
                <VStack gap="6" maxWidth="42.5rem">
                    <HStack justify="end">
                        <SpraakVelger />
                    </HStack>
                    <Heading size="xlarge" level="1">
                        Meld inn endring
                    </Heading>
                    <BodyShort>
                        Her kan du melde inn endringer relatert til livet ditt, vennligst hold det kort og ungå
                        personopplysninger. Hvis du vil ettersende dokumenter kan du gjøre det her LEGG INN LENKE.
                    </BodyShort>
                    <Box maxWidth="20rem">
                        <Select label="Hvilken type endring gjelder det?">
                            <option value="">Velg årsak</option>
                            {Object.entries(EndringerAaMeldeInn).map(([key, value]) => (
                                <option key={key} value={key}>
                                    {value}
                                </option>
                            ))}
                        </Select>
                    </Box>
                    <Box maxWidth="30rem">
                        <Textarea label="Beskrivelse" maxLength={500} />
                    </Box>
                    <div>
                        <Button icon={<PaperplaneIcon aria-hidden />} iconPosition="right">
                            Meld inn
                        </Button>
                    </div>
                </VStack>
            </HStack>
        </main>
    )
}
