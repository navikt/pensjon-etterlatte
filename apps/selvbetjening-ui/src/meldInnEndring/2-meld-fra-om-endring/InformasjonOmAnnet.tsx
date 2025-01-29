import { Alert, Heading, VStack } from '@navikt/ds-react'
import { KomponentLaster } from '../../common/KomponentLaster.tsx'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { MeldInnEndringMeldFra as MeldInnEndringMeldFraInnhold } from '../sanity.types.ts'

export const InformasjonOmAnnet = () => {
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

    if (!innhold?.informasjonOmEndring?.annet) {
        throw Error('Finner ikke sanity innhold for informasjon om endring for aktivitet og inntekt')
    }

    const { tittel, hovedinnhold, endreKontaktEllerKontonummerAlert, detViTrengerForAaBehandleEndring } =
        innhold.informasjonOmEndring.annet

    return (
        <VStack gap="6" maxWidth="42.5rem">
            <Heading size="medium">{tittel?.[spraak]}</Heading>

            <div>
                <SanityRikTekst text={hovedinnhold?.[spraak]} />
            </div>

            <Alert variant="info">
                <Heading spacing size="small">
                    {endreKontaktEllerKontonummerAlert?.tittel?.[spraak]}
                </Heading>
                <SanityRikTekst text={endreKontaktEllerKontonummerAlert?.innhold?.[spraak]} />
            </Alert>

            <div>
                <SanityRikTekst text={detViTrengerForAaBehandleEndring?.[spraak]} />
            </div>
        </VStack>
    )
}
