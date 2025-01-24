import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { MeldInnEndringMeldFra as MeldInnEndringMeldFraInnhold } from '../sanity.types.ts'
import { KomponentLaster } from '../../common/KomponentLaster.tsx'
import { Heading, ReadMore, VStack } from '@navikt/ds-react'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'

export const InformasjonOmInntekt = () => {
    const spraak = useSpraak()

    const { innhold, error, isLoading } = useSanityInnhold<MeldInnEndringMeldFraInnhold>(
        '*[_type == "meldInnEndringMeldFra"]'
    )

    if (isLoading) {
        return <KomponentLaster />
    }

    if (error) {
        throw error
    }

    if (!innhold?.informasjonOmEndring?.inntekt) {
        throw Error('Finner ikke sanity innhold for informasjon om endring for aktivitet og inntekt')
    }

    const { tittel, hovedinnhold, hvorforViSpoerOmInntektReadMore, svarPaaSpoersmaal } =
        innhold.informasjonOmEndring.inntekt

    return (
        <VStack gap="6" maxWidth="42.5rem">
            <Heading size="medium">{tittel?.[spraak]}</Heading>

            <div>
                <SanityRikTekst text={hovedinnhold?.[spraak]} />
            </div>

            <ReadMore header={hvorforViSpoerOmInntektReadMore?.tittel?.[spraak]}>
                <SanityRikTekst text={hvorforViSpoerOmInntektReadMore?.innhold?.[spraak]} />
            </ReadMore>

            <div>
                <SanityRikTekst text={svarPaaSpoersmaal?.[spraak]} />
            </div>
        </VStack>
    )
}
