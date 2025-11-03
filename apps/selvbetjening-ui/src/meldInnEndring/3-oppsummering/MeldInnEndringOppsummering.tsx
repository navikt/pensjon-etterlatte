import { FormSummary, GuidePanel, HStack, VStack } from '@navikt/ds-react'
import { format } from 'date-fns'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiURL, poster } from '../../common/api/api.ts'
import { useInnloggetInnbygger } from '../../common/innloggetInnbygger/InnloggetInnbyggerContext.tsx'
import { logger } from '../../common/logger/logger.ts'
import { NavigasjonMeny } from '../../common/navigasjonMeny/NavigasjonMeny.tsx'
import { SideLaster } from '../../common/SideLaster.tsx'
import { SanityRikTekst } from '../../common/sanity/SanityRikTekst.tsx'
import { useSanityInnhold } from '../../common/sanity/useSanityInnhold.ts'
import { SkjemaHeader } from '../../common/skjemaHeader/SkjemaHeader.tsx'
import { useSpraak } from '../../common/spraak/SpraakContext.tsx'
import { spraakTilDateFnsLocale } from '../../common/spraak/spraak.ts'
import { finnAlder } from '../../inntektsjustering/2-inntekt-til-neste-aar/finnAlder.ts'
import { SkalGaaAvMedAlderspensjon } from '../../types/inntektsjustering.ts'
import { Endring } from '../../types/meldInnEndring.ts'
import { Alder } from '../../types/person.ts'
import { forventetInntektTilNesteAarSkjemaValuesTilValues } from '../2-meld-fra-om-endring/forventetInntektTilNesteAar/skjemaer/utils.ts'
import { useMeldInnEndring } from '../components/meldInnEndringContext/MeldInnEndringContext.tsx'
import { MeldInnEndringOppsummering as MeldInnEndringOppsummeringInnhold } from '../sanity.types.ts'
import { FeilIOppretelseAvEndring } from './FeilIOppretelseAvEndring.tsx'
import { velgTekstForEndring, velgTekstForSkalGaaAvMedAlderspensjon } from './velgTekst.ts'

export const MeldInnEndringOppsummering = () => {
    const navigate = useNavigate()

    const spraak = useSpraak()
    const meldInnEndring = useMeldInnEndring()

    const [laster, setLaster] = useState<boolean>(false)
    const [apiFeil, setApiFeil] = useState<boolean>(false)

    const {
        data: innloggetBruker,
        error: innloggetBrukerError,
        isLoading: innloggetBrukerIsLoading,
    } = useInnloggetInnbygger()

    const {
        innhold,
        error: innholdError,
        isLoading: innholdIsLoading,
    } = useSanityInnhold<MeldInnEndringOppsummeringInnhold>('*[_type == "meldInnEndringOppsummering"]')

    if (innholdIsLoading || innloggetBrukerIsLoading) {
        return <SideLaster />
    }
    if (innholdError || innloggetBrukerError) {
        throw innholdError || innloggetBrukerError
    }

    const sendInnEndring = async () => {
        setLaster(true)
        setApiFeil(false)

        const body = {
            ...meldInnEndring,
            forventetInntektTilNesteAar:
                meldInnEndring.endring === Endring.FORVENTET_INNTEKT_TIL_NESTE_AAR
                    ? {
                          ...forventetInntektTilNesteAarSkjemaValuesTilValues(
                              meldInnEndring.forventetInntektTilNesteAar!
                          ),
                          inntektsaar: 2026,
                      }
                    : undefined,
        }

        try {
            const res = await poster(`${apiURL}/api/oms/meld_inn_endringer`, { body })
            if ([200, 304].includes(res.status)) {
                navigate('/meld-inn-endring/kvittering')
            }
        } catch (e) {
            logger.generalError(e as object)
            setApiFeil(true)
        }
        setLaster(false)
    }

    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })

    return (
        !!innloggetBruker &&
        !!innhold && (
            <main>
                <HStack justify="center" padding="8" minHeight="100vh">
                    <VStack gap="6" maxWidth="36rem">
                        <SkjemaHeader aktivtSteg={3} stegLabelKey="steg3" skjemaNavn="meld-inn-endring" />

                        <GuidePanel poster>
                            <SanityRikTekst text={innhold.veiledning?.[spraak]} />
                        </GuidePanel>

                        <FormSummary>
                            <FormSummary.Header>
                                <FormSummary.Heading level="2">
                                    {innhold.skjemaSammendrag?.tittel?.[spraak]}
                                </FormSummary.Heading>
                            </FormSummary.Header>
                            <FormSummary.Answers>
                                <FormSummary.Answer>
                                    <FormSummary.Label>
                                        {innhold.skjemaSammendrag?.endring?.label?.[spraak]}
                                    </FormSummary.Label>
                                    <FormSummary.Value>
                                        {velgTekstForEndring(meldInnEndring.endring, innhold, spraak)}
                                    </FormSummary.Value>
                                </FormSummary.Answer>
                                {meldInnEndring.endring !== Endring.FORVENTET_INNTEKT_TIL_NESTE_AAR ? (
                                    <FormSummary.Answer>
                                        <FormSummary.Label>
                                            {innhold.skjemaSammendrag?.beskrivelseAvEndring?.label?.[spraak]}
                                        </FormSummary.Label>
                                        <FormSummary.Value style={{ whiteSpace: 'pre-line' }}>
                                            {meldInnEndring.beskrivelse}
                                        </FormSummary.Value>
                                    </FormSummary.Answer>
                                ) : (
                                    <>
                                        {finnAlder(innloggetBruker) !== Alder.ATTEN_TIL_SEKSTI_EN && (
                                            <>
                                                <FormSummary.Answer>
                                                    <FormSummary.Label>
                                                        {finnAlder(innloggetBruker) === Alder.SEKSTI_TO_TIL_SEKSTI_SEKS
                                                            ? innhold.skjemaSammendrag?.skalGaaAvMedAlderspensjon?.label
                                                                  ?.femtiSyvTilSekstiSeksAar?.[spraak]
                                                            : innhold.skjemaSammendrag?.skalGaaAvMedAlderspensjon?.label
                                                                  ?.sekstiSyvAar?.[spraak]}
                                                    </FormSummary.Label>
                                                    <FormSummary.Value>
                                                        {!!meldInnEndring.forventetInntektTilNesteAar
                                                            ?.skalGaaAvMedAlderspensjon &&
                                                            velgTekstForSkalGaaAvMedAlderspensjon(
                                                                meldInnEndring.forventetInntektTilNesteAar
                                                                    .skalGaaAvMedAlderspensjon,
                                                                innhold,
                                                                spraak
                                                            )}
                                                    </FormSummary.Value>
                                                </FormSummary.Answer>
                                                {meldInnEndring.forventetInntektTilNesteAar
                                                    ?.skalGaaAvMedAlderspensjon === SkalGaaAvMedAlderspensjon.JA && (
                                                    <FormSummary.Answer>
                                                        <FormSummary.Label>
                                                            {
                                                                innhold.skjemaSammendrag?.datoForAaGaaAvMedAlderspensjon
                                                                    ?.label?.[spraak]
                                                            }
                                                        </FormSummary.Label>
                                                        <FormSummary.Value>
                                                            {!!meldInnEndring.forventetInntektTilNesteAar
                                                                .datoForAaGaaAvMedAlderspensjon &&
                                                                format(
                                                                    meldInnEndring.forventetInntektTilNesteAar
                                                                        .datoForAaGaaAvMedAlderspensjon,
                                                                    'MMMM yyyy',
                                                                    {
                                                                        locale: spraakTilDateFnsLocale(spraak),
                                                                    }
                                                                )}
                                                        </FormSummary.Value>
                                                    </FormSummary.Answer>
                                                )}
                                            </>
                                        )}
                                        <FormSummary.Answer>
                                            <FormSummary.Label>
                                                {innhold?.skjemaSammendrag?.arbeidsinntekt?.label?.[spraak]}
                                            </FormSummary.Label>
                                            <FormSummary.Value>
                                                {meldInnEndring.forventetInntektTilNesteAar?.arbeidsinntekt} kr
                                            </FormSummary.Value>
                                        </FormSummary.Answer>

                                        <FormSummary.Answer>
                                            <FormSummary.Label>
                                                {innhold?.skjemaSammendrag?.naeringsinntekt?.label?.[spraak]}
                                            </FormSummary.Label>
                                            <FormSummary.Value>
                                                {meldInnEndring.forventetInntektTilNesteAar?.naeringsinntekt} kr
                                            </FormSummary.Value>
                                        </FormSummary.Answer>

                                        {finnAlder(innloggetBruker) !== Alder.ATTEN_TIL_SEKSTI_EN && (
                                            <FormSummary.Answer>
                                                <FormSummary.Label>
                                                    {innhold?.skjemaSammendrag?.AFPInntekt?.label?.[spraak]}
                                                </FormSummary.Label>
                                                <FormSummary.Value>
                                                    {meldInnEndring.forventetInntektTilNesteAar?.afpInntekt} kr
                                                </FormSummary.Value>
                                            </FormSummary.Answer>
                                        )}

                                        {!!meldInnEndring.forventetInntektTilNesteAar?.afpInntekt &&
                                            meldInnEndring.forventetInntektTilNesteAar?.afpInntekt !== '0' && (
                                                <FormSummary.Answer>
                                                    <FormSummary.Label>
                                                        {innhold?.skjemaSammendrag?.AFPTjenesteordning?.label?.[spraak]}
                                                    </FormSummary.Label>
                                                    <FormSummary.Value>
                                                        {meldInnEndring.forventetInntektTilNesteAar?.afpTjenesteordning}
                                                    </FormSummary.Value>
                                                </FormSummary.Answer>
                                            )}
                                        <FormSummary.Answer>
                                            <FormSummary.Label>
                                                {innhold?.skjemaSammendrag?.inntektFraUtland?.label?.[spraak]}
                                            </FormSummary.Label>
                                            <FormSummary.Value>
                                                {meldInnEndring.forventetInntektTilNesteAar?.inntektFraUtland} kr
                                            </FormSummary.Value>
                                        </FormSummary.Answer>
                                    </>
                                )}
                            </FormSummary.Answers>
                            <FormSummary.Footer>
                                <FormSummary.EditLink
                                    href="#"
                                    onClick={() => navigate('/meld-inn-endring/meld-fra-om-endring')}
                                >
                                    {innhold.skjemaSammendrag?.endreSvarLenke?.tekst?.[spraak]}
                                </FormSummary.EditLink>
                            </FormSummary.Footer>
                        </FormSummary>

                        {apiFeil && <FeilIOppretelseAvEndring />}

                        <NavigasjonMeny
                            tilbakePath="/meld-inn-endring/meld-fra-om-endring"
                            onNeste={sendInnEndring}
                            nesteLaster={laster}
                            skalSendeInnSkjema
                        />
                    </VStack>
                </HStack>
            </main>
        )
    )
}
