import { ArrowRightIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'
import { KomponentLaster } from '../../../../common/KomponentLaster.tsx'
import { SanityRikTekst } from '../../../../common/sanity/SanityRikTekst.tsx'
import { useSanityInnhold } from '../../../../common/sanity/useSanityInnhold.ts'
import { useSpraak } from '../../../../common/spraak/SpraakContext.tsx'
import { MeldInnEndringMeldFra } from '../../../sanity.types.ts'

export const IkkeGyldigAlder = () => {
    const spraak = useSpraak()

    const { innhold, innholdError, innholdIsLoading } = useSanityInnhold<MeldInnEndringMeldFra>(
        '*[_type == "meldInnEndringMeldFra"]'
    )

    if (innholdIsLoading) {
        return <KomponentLaster />
    }
    if (innholdError) {
        throw innholdError
    }

    return (
        !!innhold && (
            <>
                <div>
                    <SanityRikTekst
                        text={innhold.forventetInntektTilNesteAarSkjemer?.ikkeGyldigAlder?.innhold?.[spraak]}
                    />
                </div>
                <div>
                    <Button
                        as={'a'}
                        variant="primary"
                        icon={<ArrowRightIcon aria-hidden />}
                        iconPosition="right"
                        rel="noopener noreferrer"
                        href={
                            innhold.forventetInntektTilNesteAarSkjemer?.ikkeGyldigAlder?.gaaTilNAVKnapp?.lenke?.[spraak]
                        }
                    >
                        {innhold.forventetInntektTilNesteAarSkjemer?.ikkeGyldigAlder?.gaaTilNAVKnapp?.tekst?.[spraak]}
                    </Button>
                </div>
            </>
        )
    )
}
