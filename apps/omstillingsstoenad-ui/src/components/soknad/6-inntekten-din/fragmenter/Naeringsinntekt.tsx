import { useTranslation } from 'react-i18next'
import React from 'react'
import { Alert, BodyShort, Heading } from '@navikt/ds-react'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { RHFValutaInput } from '../../../felles/rhf/RHFInput'
import Bredde from '../../../../typer/bredde'
import EndringInntekt from './EndringInntekt'
import { useFormContext } from 'react-hook-form'
import { IInntekt, NorgeOgUtland } from '../../../../typer/inntekt'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'
import { doedsdatoErIAar, erMellomOktoberogDesember } from '../../../../utils/dato'
import { useSoknadContext } from '../../../../context/soknad/SoknadContext'
import SesongbasertNaeringsinntekt from './SesongbasertNaeringsinntekt'

const Naeringsinntekt = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<IInntekt>()
    const { state: soknadState } = useSoknadContext()

    const datoforDoedsfallet = soknadState.omDenAvdoede.datoForDoedsfallet

    const norgeEllerUtland = watch('naeringsinntekt.norgeEllerUtland')

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <Heading size={'medium'}>{t('inntektenDin.naeringsinntekt.tittel')}</Heading>
                <BodyShort>{t('inntektenDin.naeringsinntekt.ingress')}</BodyShort>
            </SkjemaElement>

            <SkjemaElement>
                <RHFCheckboksGruppe
                    name={'naeringsinntekt.norgeEllerUtland'}
                    checkboxes={Object.values(NorgeOgUtland).map((value) => {
                        return { children: t(value), value, required: true }
                    })}
                    legend={t('inntektenDin.naeringsinntekt.norgeEllerUtland')}
                />
            </SkjemaElement>

            {norgeEllerUtland?.includes(NorgeOgUtland.norge) && (
                <>
                    <SkjemaElement>
                        <Heading size={'small'}>{t('inntektenDin.naeringsinntekt.norgeEllerUtland.norge')}</Heading>
                    </SkjemaElement>
                    <SkjemaElement>
                        <SesongbasertNaeringsinntekt type={'norge'} />
                    </SkjemaElement>
                    <SkjemaElement>
                        <RHFValutaInput
                            name={'naeringsinntekt.norge.arbeidsinntektAaretFoer'}
                            label={
                                doedsdatoErIAar(datoforDoedsfallet!!)
                                    ? t('inntektenDin.naeringsinntekt.norge.arbeidsinntektAaretFoer')
                                    : t('inntektenDin.naeringsinntekt.arbeidsinntektAaretFoer.doedsfallAaretFoer')
                            }
                            description={
                                doedsdatoErIAar(datoforDoedsfallet!!)
                                    ? t('inntektenDin.naeringsinntekt.arbeidsinntektAaretFoer.beskrivelse')
                                    : t(
                                          'inntektenDin.naeringsinntekt.arbeidsinntektAaretFoer.doedsfallAaretFoer.beskrivelse'
                                      )
                            }
                            htmlSize={Bredde.S}
                        />
                    </SkjemaElement>

                    <SkjemaGruppe>
                        <SkjemaElement>
                            <RHFValutaInput
                                name={'naeringsinntekt.norge.arbeidsinntektIAar.aarsinntekt'}
                                label={t('inntektenDin.naeringsinntekt.arbeidsinntektIAar.aarsinntekt')}
                                description={t('inntektenDin.loennsinntekt.arbeidsinntektIAar.aarsinntekt.beskrivelse')}
                                htmlSize={Bredde.S}
                            />
                        </SkjemaElement>
                    </SkjemaGruppe>
                    {erMellomOktoberogDesember() && (
                        <SkjemaGruppe>
                            <RHFValutaInput
                                name={'naeringsinntekt.norge.arbeidsinntektIAar.etterDoedsfall'}
                                label={t('inntektenDin.naeringsinntekt.norge.arbeidsinntektIAar.etterDoedsfall')}
                                htmlSize={Bredde.S}
                            />
                        </SkjemaGruppe>
                    )}
                </>
            )}

            {norgeEllerUtland?.length === 2 && <hr />}

            {norgeEllerUtland?.includes(NorgeOgUtland.utland) && (
                <>
                    <SkjemaElement>
                        <Heading size={'small'}>{t('inntektenDin.naeringsinntekt.norgeEllerUtland.utland')}</Heading>
                    </SkjemaElement>
                    <SkjemaElement>
                        <SesongbasertNaeringsinntekt type={'utland'} />
                    </SkjemaElement>
                    <SkjemaElement>
                        <RHFValutaInput
                            name={'naeringsinntekt.utland.arbeidsinntektAaretFoer'}
                            label={
                                doedsdatoErIAar(datoforDoedsfallet!!)
                                    ? t('inntektenDin.naeringsinntekt.utland.arbeidsinntektAaretFoer')
                                    : t('inntektenDin.naeringsinntekt.arbeidsinntektAaretFoer.doedsfallAaretFoer')
                            }
                            description={t('inntektenDin.naeringsinntekt.arbeidsinntektAaretFoer.beskrivelse.utland')}
                            htmlSize={Bredde.S}
                        />
                    </SkjemaElement>
                    <SkjemaGruppe>
                        <SkjemaElement>
                            <RHFValutaInput
                                name={'naeringsinntekt.utland.arbeidsinntektIAar.aarsinntekt'}
                                label={t('inntektenDin.naeringsinntekt.arbeidsinntektIAar.aarsinntekt')}
                                description={t('inntektenDin.loennsinntekt.arbeidsinntektIAar.aarsinntekt.beskrivelse')}
                                htmlSize={Bredde.S}
                            />
                        </SkjemaElement>
                    </SkjemaGruppe>
                    {erMellomOktoberogDesember() && (
                        <SkjemaGruppe>
                            <RHFValutaInput
                                name={'naeringsinntekt.utland.arbeidsinntektIAar.etterDoedsfall'}
                                label={t('inntektenDin.naeringsinntekt.utland.arbeidsinntektIAar.etterDoedsfall')}
                                htmlSize={Bredde.S}
                            />
                        </SkjemaGruppe>
                    )}
                </>
            )}

            <Alert variant={'info'}>{t('inntektenDin.naeringsinntekt.info')}</Alert>

            <EndringInntekt type={'naeringsinntekt'} />
        </SkjemaGruppe>
    )
}

export default Naeringsinntekt
