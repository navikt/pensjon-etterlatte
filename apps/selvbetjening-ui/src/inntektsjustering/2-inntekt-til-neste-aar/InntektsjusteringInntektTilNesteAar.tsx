import { Accordion, Heading, HStack, VStack } from '@navikt/ds-react'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'
import { InntektsjusteringInntektTilNesteAar as InntektsjusteringInntektTilNesteAarInnhold } from '../../sanity.types.ts'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { Navigate } from 'react-router-dom'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'
import useSWR, { SWRResponse } from 'swr'
import { IInnloggetBruker } from '../../types/person.ts'
import { apiURL } from '../../utils/api.ts'
import { AttenTilFemtiSeksAarSkjema } from './skjemaer/AttenTilFemtiSeksAarSkjema.tsx'

enum Alder {
    UNDER_ATTEN,
    ATTEN_TIL_FEMTI_SEKS,
    FEMTI_SYV_TIL_SEKSTI,
    SEKSTI_EN_TIL_SEKSTI_SEKS,
    SEKSTI_SYV,
}

export const InntektsjusteringInntektTilNesteAar = () => {
    const spraak = useSpraak()

    const {
        data: innloggetBruker,
        error: innloggetBrukerError,
        isLoading: innloggetBrukerIsLoading,
    }: SWRResponse<IInnloggetBruker, boolean, boolean> = useSWR(`${apiURL}/api/person/innlogget`)

    const {
        innhold,
        error: innholdError,
        isLoading: innholdIsLoading,
    } = useSanityInnhold<InntektsjusteringInntektTilNesteAarInnhold>(
        '*[_type == "inntektsjusteringInntektTilNesteAar"]'
    )

    if (innloggetBrukerError && !innloggetBrukerIsLoading) {
        return <Navigate to="/system-utilgjengelig" />
    }

    if (innholdError && !innholdIsLoading) {
        return <Navigate to="/system-utilgjengelig" />
    }

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

                        {velgSkjemaForInntekt(Alder.ATTEN_TIL_FEMTI_SEKS)}
                    </VStack>
                </HStack>
            </main>
        )
    )
}
