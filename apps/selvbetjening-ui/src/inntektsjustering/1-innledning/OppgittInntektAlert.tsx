import { Inntekt, SkalGaaAvMedAlderspensjon } from '../../types/inntektsjustering.ts'
import { Alder, IInnloggetBruker } from '../../types/person.ts'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import {
    FellesKomponenter,
    InntektsjusteringInnledning as InntektsjusteringInnledningInnhold,
} from '../../sanity.types.ts'
import { Navigate } from 'react-router-dom'
import { Alert, BodyShort, Heading, Label, VStack } from '@navikt/ds-react'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { finnAlder } from '../2-inntekt-til-neste-aar/finnAlder.ts'
import { format, Locale } from 'date-fns'
import { Spraak } from '../../common/spraak/spraak.ts'
import { enGB, nb, nn } from 'date-fns/locale'

const spraakTilDateFnsLocale = (spraak: Spraak): Locale => {
    switch (spraak) {
        case Spraak.BOKMAAL:
            return nb
        case Spraak.NYNORSK:
            return nn
        case Spraak.ENGELSK:
            return enGB
        default:
            return nb
    }
}

export const OppgittInntektAlert = ({
    inntekt,
    innloggetBruker,
}: {
    inntekt: Inntekt
    innloggetBruker: IInnloggetBruker
}) => {
    const spraak = useSpraak()

    const {
        innhold: fellesKomponenterInnhold,
        error: fellesKomponenterInnholdError,
        isLoading: fellesKomponenterInnholdIsLoading,
    } = useSanityInnhold<FellesKomponenter>('*[_type == "fellesKomponenter"]')

    const {
        innhold: inntektsjusteringInnledningInnhold,
        error: inntektsjusteringInnledningInnholdError,
        isLoading: inntektsjusteringInnledningInnholdIsLoading,
    } = useSanityInnhold<InntektsjusteringInnledningInnhold>('*[_type == "inntektsjusteringInnledning"]')

    if (fellesKomponenterInnholdError && !fellesKomponenterInnholdIsLoading) {
        return <Navigate to="/system-utilgjengelig" />
    }

    if (inntektsjusteringInnledningInnholdError && !inntektsjusteringInnledningInnholdIsLoading) {
        return <Navigate to="/system-utilgjengelig" />
    }

    const velgTekstForSkalGaaAvMedAlderspensjon = (
        skalGaaAvMedAlderspensjonValue: SkalGaaAvMedAlderspensjon
    ): string | undefined => {
        switch (skalGaaAvMedAlderspensjonValue) {
            case SkalGaaAvMedAlderspensjon.JA:
                return fellesKomponenterInnhold?.sammendragAvInntekt?.skalGaaAvMedAlderspensjon?.value?.ja?.[spraak]
            case SkalGaaAvMedAlderspensjon.NEI:
                return fellesKomponenterInnhold?.sammendragAvInntekt?.skalGaaAvMedAlderspensjon?.value?.nei?.[spraak]
            case SkalGaaAvMedAlderspensjon.VET_IKKE:
                return fellesKomponenterInnhold?.sammendragAvInntekt?.skalGaaAvMedAlderspensjon?.value?.vetIkke?.[
                    spraak
                ]
        }
    }

    return (
        !!fellesKomponenterInnhold &&
        !!inntektsjusteringInnledningInnhold && (
            <Alert variant="info">
                <Heading spacing size="small" level="3">
                    {inntektsjusteringInnledningInnhold.oppgittInntektAlert?.tittel?.[spraak]}
                </Heading>

                <VStack gap="6">
                    <BodyShort>{inntektsjusteringInnledningInnhold.oppgittInntektAlert?.innhold?.[spraak]}</BodyShort>

                    <VStack gap="2">
                        {finnAlder(innloggetBruker) !== Alder.ATTEN_TIL_FEMTI_SEKS && (
                            <>
                                <div>
                                    <Label>
                                        {finnAlder(innloggetBruker) === Alder.FEMTI_SYV_TIL_SEKSTI_SEKS
                                            ? fellesKomponenterInnhold?.sammendragAvInntekt?.skalGaaAvMedAlderspensjon
                                                  ?.label?.femtiSyvTilSekstiSeksAar?.[spraak]
                                            : fellesKomponenterInnhold?.sammendragAvInntekt?.skalGaaAvMedAlderspensjon
                                                  ?.label?.femtiSyvTilSekstiSeksAar?.[spraak]}
                                    </Label>
                                    <BodyShort>
                                        {!!inntekt.skalGaaAvMedAlderspensjon &&
                                            velgTekstForSkalGaaAvMedAlderspensjon(inntekt.skalGaaAvMedAlderspensjon)}
                                    </BodyShort>
                                </div>
                                {inntekt.skalGaaAvMedAlderspensjon === SkalGaaAvMedAlderspensjon.JA && (
                                    <div>
                                        <Label>
                                            {
                                                fellesKomponenterInnhold.sammendragAvInntekt
                                                    ?.datoForAaGaaAvMedAlderspensjon?.label?.[spraak]
                                            }
                                        </Label>
                                        <BodyShort>
                                            {!!inntekt.datoForAaGaaAvMedAlderspensjon &&
                                                format(inntekt.datoForAaGaaAvMedAlderspensjon, 'MMMM yyyy', {
                                                    locale: spraakTilDateFnsLocale(spraak),
                                                })}
                                        </BodyShort>
                                    </div>
                                )}
                            </>
                        )}
                        <div>
                            <Label>
                                {fellesKomponenterInnhold.sammendragAvInntekt?.arbeidsinntekt?.label?.[spraak]}
                            </Label>
                            <BodyShort>{inntekt.arbeidsinntekt} kr</BodyShort>
                        </div>

                        <div>
                            <Label>
                                {fellesKomponenterInnhold.sammendragAvInntekt?.naeringsinntekt?.label?.[spraak]}
                            </Label>
                            <BodyShort>{inntekt.naeringsinntekt} kr</BodyShort>
                        </div>

                        {finnAlder(innloggetBruker) !== Alder.ATTEN_TIL_FEMTI_SEKS && (
                            <div>
                                <Label>
                                    {fellesKomponenterInnhold.sammendragAvInntekt?.AFPInntekt?.label?.[spraak]}
                                </Label>
                                <BodyShort>{inntekt.AFPInntekt} kr</BodyShort>
                            </div>
                        )}

                        {!!inntekt.AFPInntekt && (
                            <div>
                                <Label>
                                    {fellesKomponenterInnhold.sammendragAvInntekt?.AFPTjenesteordning?.label?.[spraak]}
                                </Label>
                                <BodyShort>{inntekt.AFPTjenesteordning}</BodyShort>
                            </div>
                        )}
                        <div>
                            <Label>
                                {fellesKomponenterInnhold.sammendragAvInntekt?.inntektFraUtland?.label?.[spraak]}
                            </Label>
                            <BodyShort>{inntekt.inntektFraUtland} kr</BodyShort>
                        </div>
                    </VStack>
                    <BodyShort>
                        {inntektsjusteringInnledningInnhold?.oppgittInntektAlert?.inntektIkkeKorrekt?.[spraak]}
                    </BodyShort>
                </VStack>
            </Alert>
        )
    )
}
