import { BodyShort, Heading, Hide, HStack, VStack } from '@navikt/ds-react'
import { SpraakVelger } from '../spraakVelger/SpraakVelger.tsx'
import { VarigLoonnstilskuddIcon } from './icons/VarigLoonnstilskuddIcon.tsx'
import { SkjemaProgresjon } from './SkjemaProgresjon.tsx'
import { useSanityInnhold } from '../sanity/useSanityInnhold.ts'
import { SkjemaHeader as SkjemaHeaderInnhold } from '../sanity.types.ts'
import { useSpraak } from '../spraak/SpraakContext.tsx'
import { SideLaster } from '../SideLaster.tsx'
import { FyllUtSkjemaIcon } from './icons/FyllUtSkjemaIcon.tsx'

interface Props {
    aktivtSteg: number
    stegLabelKey: 'steg1' | 'steg2' | 'steg3' | 'steg4'
    skjemaNavn: 'inntektsjustering' | 'meld-inn-endring'
}

export const SkjemaHeader = ({ aktivtSteg, stegLabelKey, skjemaNavn }: Props) => {
    const spraak = useSpraak()

    const { innhold, error, isLoading } = useSanityInnhold<SkjemaHeaderInnhold>(
        `*[_type == "skjemaHeader" ${encodeURIComponent('&&')} dokumentTittel == "${skjemaNavn}"]`
    )

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
                        {skjemaNavn === 'inntektsjustering' && <VarigLoonnstilskuddIcon aria-hidden />}
                        {skjemaNavn === 'meld-inn-endring' && <FyllUtSkjemaIcon aria-hidden />}
                    </Hide>
                    <VStack>
                        <BodyShort size="small">Nav 17-09.02</BodyShort>
                        <Heading size="xlarge" level="1">
                            {innhold.skjemaTittel?.[spraak]}
                        </Heading>
                    </VStack>
                </HStack>

                {/* TODO: dette er litt hacky, må finne bedre måte å løse det på */}
                <Heading size="large" level="2">
                    {innhold.skjemaProgresjon?.stegLabels?.[stegLabelKey]?.[spraak]}
                </Heading>

                <SkjemaProgresjon aktivtSteg={aktivtSteg} skjemaNavn={skjemaNavn} />
            </VStack>
        )
    )
}
