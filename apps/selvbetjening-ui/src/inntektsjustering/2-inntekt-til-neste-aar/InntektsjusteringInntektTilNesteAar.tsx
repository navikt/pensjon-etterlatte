import { Accordion, Heading, HStack, VStack } from '@navikt/ds-react'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'
import { InntektsjusteringInntektTilNesteAar as InntektsjusteringInntektTilNesteAarInnhold } from '../../sanity.types.ts'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { Navigate } from 'react-router-dom'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'
import { Alder } from '../../types/person.ts'
import { AttenTilFemtiSeksAarSkjema } from './skjemaer/AttenTilFemtiSeksAarSkjema.tsx'
import { finnAlder } from './finnAlder.ts'

export const InntektsjusteringInntektTilNesteAar = () => {
    const spraak = useSpraak()

    const {
        innhold,
        error: innholdError,
        isLoading: innholdIsLoading,
    } = useSanityInnhold<InntektsjusteringInntektTilNesteAarInnhold>(
        '*[_type == "inntektsjusteringInntektTilNesteAar"]'
    )

    if (innholdError && !innholdIsLoading) {
        return <Navigate to="/system-utilgjengelig" />
    }

    // TODO: denne her fylles ut når andre skjemaene kommer på plass
    //       trenger også en default for når personen ikke er gyldig for å fylle inn inntekt
    const velgSkjemaForInntekt = (alder: Alder) => {
        switch (alder) {
            case Alder.ATTEN_TIL_FEMTI_SEKS:
                return <AttenTilFemtiSeksAarSkjema />
        }
    }

    return (
        !!innhold && (
            <main>
                <HStack justify="center" padding="8">
                    <VStack gap="6" maxWidth="42.5rem">
                        <SkjemaHeader aktivtSteg={2} stegLabelKey="steg2" />

                        <SanityRikTekst text={innhold.hovedinnhold?.[spraak]} />

                        <div>
                            <Heading size="small" level="2" spacing>
                                {innhold.inntektAccordions?.tittel?.[spraak]}
                            </Heading>
                            <Accordion>
                                <Accordion.Item>
                                    <Accordion.Header>
                                        {innhold.inntektAccordions?.arbeidsinntekt?.tittel?.[spraak]}
                                    </Accordion.Header>
                                    <Accordion.Content>
                                        <SanityRikTekst
                                            text={innhold.inntektAccordions?.arbeidsinntekt?.innhold?.[spraak]}
                                        />
                                    </Accordion.Content>
                                </Accordion.Item>
                                <Accordion.Item>
                                    <Accordion.Header>
                                        {innhold.inntektAccordions?.naeringsinntekt?.tittel?.[spraak]}
                                    </Accordion.Header>
                                    <Accordion.Content>
                                        <SanityRikTekst
                                            text={innhold.inntektAccordions?.naeringsinntekt?.innhold?.[spraak]}
                                        />
                                    </Accordion.Content>
                                </Accordion.Item>
                                <Accordion.Item>
                                    <Accordion.Header>
                                        {innhold.inntektAccordions?.AFPInntekt?.tittel?.[spraak]}
                                    </Accordion.Header>
                                    <Accordion.Content>
                                        <SanityRikTekst
                                            text={innhold.inntektAccordions?.AFPInntekt?.innhold?.[spraak]}
                                        />
                                    </Accordion.Content>
                                </Accordion.Item>
                                <Accordion.Item>
                                    <Accordion.Header>
                                        {innhold.inntektAccordions?.alleInntekterIUtland?.tittel?.[spraak]}
                                    </Accordion.Header>
                                    <Accordion.Content>
                                        <SanityRikTekst
                                            text={innhold.inntektAccordions?.alleInntekterIUtland?.innhold?.[spraak]}
                                        />
                                    </Accordion.Content>
                                </Accordion.Item>
                            </Accordion>
                        </div>
                        {/* TODO: bruker hardkodet person helt til vi har dette på plass i backend */}
                        {velgSkjemaForInntekt(finnAlder({ foedselsdato: new Date(1975, 4, 11) }))}
                    </VStack>
                </HStack>
            </main>
        )
    )
}
