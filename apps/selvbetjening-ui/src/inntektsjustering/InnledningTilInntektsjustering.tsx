import { Alert, Bleed, BodyShort, Button, GuidePanel, Heading, HStack, Link, VStack } from '@navikt/ds-react'
import useSWR, { SWRResponse } from 'swr'
import { IInnloggetBruker } from '../types/person.ts'
import { apiURL } from '../utils/api.ts'
import { ArrowRightIcon } from '@navikt/aksel-icons'

export const InnledningTilInntektsjustering = () => {
    const { data }: SWRResponse<IInnloggetBruker, boolean, boolean> = useSWR(`${apiURL}/api/person/innlogget`)

    return (
        <HStack justify="center" paddingBlock="8">
            <VStack gap="4" maxWidth="40rem">
                <Heading size="xlarge" level="1">
                    Meld fra om inntekt til neste år
                </Heading>

                <Heading size="large" level="2">
                    Hei! {data?.fornavn}
                </Heading>

                <Heading size="medium" level="3">
                    Her kan du melde fra om forventet inntekt til neste år.
                </Heading>

                <BodyShort>
                    I dette skjemaet kan du melde fra om hva du forventer å tjene ved siden av omstillingsstønaden.
                    Inntekten du oppgir, skal være brutto inntekt, altså inntekt før skatt.
                </BodyShort>

                <BodyShort>
                    Ønsker du å opplyse om endring i innværende år, må du bruke skjemaet{' '}
                    <Link href="#">melding om inntekt når du har omstillingsstønad.</Link>
                </BodyShort>

                <Alert variant="info">
                    Hvis inntekten din endrer seg etter du har sendt inn skjemaet, må du informere oss på nytt.
                </Alert>
                <Bleed marginInline="10 0">
                    <GuidePanel>
                        Vi lagrer et utkast av skjemaet automatisk hver gang du går til neste steg. Du finner utkastet
                        på Min side. NAV kan ikke se informasjonen i utkastet. Du må trykke på “Send til NAV” for at NAV
                        skal motta skjemaet/søknaden.
                    </GuidePanel>
                </Bleed>
                <div>
                    <Button icon={<ArrowRightIcon aria-hidden />} iconPosition="right">
                        Start utfyllingen
                    </Button>
                </div>
            </VStack>
        </HStack>
    )
}
