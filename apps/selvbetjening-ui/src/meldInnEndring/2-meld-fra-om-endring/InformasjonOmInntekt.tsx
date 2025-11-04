import { Heading, ReadMore, VStack } from '@navikt/ds-react'
import { KomponentLaster } from '../../common/KomponentLaster.tsx'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { MeldInnEndringMeldFra as MeldInnEndringMeldFraInnhold } from '../sanity.types.ts'

export const InformasjonOmInntekt = () => {
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
