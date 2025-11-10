import { Heading, Hide, HStack, VStack } from '@navikt/ds-react'
import { SideLaster } from '../SideLaster.tsx'
import { useSanityInnhold } from '../sanity/useSanityInnhold.ts'
import { SkjemaHeader as SkjemaHeaderInnhold } from '../sanity.types.ts'
import { useSpraak } from '../spraak/SpraakContext.tsx'
import { SpraakVelger } from '../spraakVelger/SpraakVelger.tsx'
import { FyllUtSkjemaIcon } from './icons/FyllUtSkjemaIcon.tsx'
import { SkjemaProgresjon } from './SkjemaProgresjon.tsx'

interface Props {
    aktivtSteg: number
    stegLabelKey: 'steg1' | 'steg2' | 'steg3' | 'steg4'
    skjemaNavn: 'meld-inn-endring'
}

export const SkjemaHeader = ({ aktivtSteg, stegLabelKey, skjemaNavn }: Props) => {
    const spraak = useSpraak()

    const { innhold, innholdError, innholdIsLoading } = useSanityInnhold<SkjemaHeaderInnhold>(
        `*[_type == "skjemaHeader" ${encodeURIComponent('&&')} dokumentTittel == "${skjemaNavn}"]`
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
                <HStack justify="end">
                    <SpraakVelger />
                </HStack>
                <HStack gap="4" align="center">
                    <Hide below="md">{skjemaNavn === 'meld-inn-endring' && <FyllUtSkjemaIcon aria-hidden />}</Hide>
                    <VStack>
                        <Heading size="xlarge" level="1">
                            {innhold.skjemaTittel?.[spraak]}
                        </Heading>
                    </VStack>
                </HStack>

                <Heading size="large" level="2">
                    {innhold.skjemaProgresjon?.stegLabels?.[stegLabelKey]?.[spraak]}
                </Heading>

                <SkjemaProgresjon aktivtSteg={aktivtSteg} skjemaNavn={skjemaNavn} />
            </VStack>
        )
    )
}
