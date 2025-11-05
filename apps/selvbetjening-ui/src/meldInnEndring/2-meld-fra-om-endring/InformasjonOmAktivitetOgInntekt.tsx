import { Accordion, Heading, VStack } from '@navikt/ds-react'
import { KomponentLaster } from '../../common/KomponentLaster.tsx'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { MeldInnEndringMeldFra as MeldInnEndringMeldFraInnhold } from '../sanity.types.ts'

export const InformasjonOmAktivitetOgInntekt = () => {
    const spraak = useSpraak()

    const { innhold, innholdError, innholdIsLoading } = useSanityInnhold<MeldInnEndringMeldFraInnhold>(
        '*[_type == "meldInnEndringMeldFra"]'
    )

    if (innholdIsLoading) {
        return <KomponentLaster />
    }

    if (innholdError) {
        throw innholdError
    }

    if (!innhold?.informasjonOmEndring?.aktivitetOgInntekt) {
        throw Error('Finner ikke sanity innhold for informasjon om endring for aktivitet og inntekt')
    }

    const { tittel, endringAccordion, hovedinnhold } = innhold.informasjonOmEndring.aktivitetOgInntekt

    return (
        <VStack gap="6" maxWidth="42.5rem">
            <Heading size="medium">{tittel?.[spraak]}</Heading>

            <Accordion>
                <Accordion.Item>
                    <Accordion.Header>{endringAccordion?.jobbItem?.tittel?.[spraak]}</Accordion.Header>
                    <Accordion.Content>
                        <SanityRikTekst text={endringAccordion?.jobbItem?.innhold?.[spraak]} />
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item>
                    <Accordion.Header>{endringAccordion?.studierItem?.tittel?.[spraak]}</Accordion.Header>
                    <Accordion.Content>
                        <SanityRikTekst text={endringAccordion?.studierItem?.innhold?.[spraak]} />
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item>
                    <Accordion.Header>{endringAccordion?.annenAktivitetItem?.tittel?.[spraak]}</Accordion.Header>
                    <Accordion.Content>
                        <SanityRikTekst text={endringAccordion?.annenAktivitetItem?.innhold?.[spraak]} />
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion>

            <div>
                <SanityRikTekst text={hovedinnhold?.[spraak]} />
            </div>
        </VStack>
    )
}
