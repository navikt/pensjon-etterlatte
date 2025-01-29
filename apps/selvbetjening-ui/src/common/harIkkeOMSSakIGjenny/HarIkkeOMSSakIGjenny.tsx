import { ArrowRightIcon } from '@navikt/aksel-icons'
import { Button, VStack } from '@navikt/ds-react'
import { SideLaster } from '../SideLaster.tsx'
import { HarIkkeOMSSakIGjenny as HarIkkeOMSSakIGjennyInnhold } from '../sanity.types.ts'
import { SanityRikTekst } from '../sanity/SanityRikTekst.tsx'
import { useSanityInnhold } from '../sanity/useSanityInnhold.ts'
import { useSpraak } from '../spraak/SpraakContext.tsx'

export const HarIkkeOMSSakIGjenny = ({ skjemaNavn }: { skjemaNavn: 'inntektsjustering' | 'meld-inn-endring' }) => {
    const spraak = useSpraak()

    const {
        innhold,
        error: innholdError,
        isLoading: innholdIsLoading,
    } = useSanityInnhold<HarIkkeOMSSakIGjennyInnhold>(
        `*[_type == "harIkkeOMSSakIGjenny" ${encodeURIComponent('&&')} dokumentTittel == "${skjemaNavn}"]`
    )

    if (innholdIsLoading) {
        return <SideLaster />
    }

    if (innholdError) {
        throw innholdError
    }

    return (
        !!innhold && (
            <VStack gap="6">
                <div>
                    <SanityRikTekst text={innhold.innhold?.[spraak]} />
                </div>
                <div>
                    <Button
                        as="a"
                        variant="primary"
                        icon={<ArrowRightIcon aria-hidden />}
                        iconPosition="right"
                        rel="noopener noreferrer"
                        href={innhold.gaaTilNAVKnapp?.lenke?.[spraak]}
                    >
                        {innhold.gaaTilNAVKnapp?.tekst?.[spraak]}
                    </Button>
                </div>
            </VStack>
        )
    )
}
