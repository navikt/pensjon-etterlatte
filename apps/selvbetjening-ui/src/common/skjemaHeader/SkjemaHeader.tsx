import { Heading, Hide, HStack, VStack } from '@navikt/ds-react'
import { SpraakVelger } from '../spraak/SpraakVelger.tsx'
import { VarigLoonnstilskuddIcon } from '../../inntektsjustering/1-innledning/icons/VarigLoonnstilskuddIcon.tsx'
import { SkjemaProgresjon } from '../SkjemaProgresjon.tsx'
import { useSanityInnhold } from '../sanity/useSanityInnhold.ts'
import { FellesKomponenter } from '../../sanity.types.ts'
import { useSpraak } from '../spraak/SpraakContext.tsx'
import { SideLaster } from '../SideLaster.tsx'

interface Props {
    aktivtSteg: number
    stegLabelKey: 'steg1' | 'steg2' | 'steg3' | 'steg4'
}

export const SkjemaHeader = ({ aktivtSteg, stegLabelKey }: Props) => {
    const spraak = useSpraak()

    const { innhold, error, isLoading } = useSanityInnhold<FellesKomponenter>('*[_type == "fellesKomponenter"]')

    if (isLoading) {
        return <SideLaster />
    }
    if (error) {
        throw error
    }

    return (
        !!innhold && (
            <VStack gap="6">
                <HStack justify="end">
                    <SpraakVelger />
                </HStack>
                <HStack gap="4" align="center">
                    <Hide below="md">
                        <VarigLoonnstilskuddIcon />
                    </Hide>
                    <Heading size="xlarge" level="1">
                        {innhold.skjemaTittel?.[spraak]}
                    </Heading>
                </HStack>

                {/* TODO: dette er litt hacky, må finne bedre måte å løse det på */}
                <Heading size="large" level="2">
                    {innhold.skjemaProgresjon?.stegLabels?.[stegLabelKey]?.[spraak]}
                </Heading>

                <SkjemaProgresjon aktivtSteg={aktivtSteg} />
            </VStack>
        )
    )
}
