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
                        {doedsdatoErIAar(datoforDoedsfallet!!) ? (
                            <RHFValutaInput
                                name={'naeringsinntekt.norge.inntektIFjor.aarsinntekt'}
                                label={t('inntektenDin.naeringsinntekt.norge.inntektIFjor.aarsinntekt')}
                                description={t('inntektenDin.naeringsinntekt.inntektIFjor.aarsinntekt.beskrivelse')}
                                htmlSize={Bredde.S}
                            />
                        ) : (
                            <RHFValutaInput
                                name={'naeringsinntekt.norge.arbeidsinntektDoedsfallsaaret'}
                                label={t('inntektenDin.naeringsinntekt.inntektIFjor.aarsinntekt.doedsfallAaretFoer')}
                                description={t(
                                    'inntektenDin.naeringsinntekt.inntektIFjor.aarsinntekt.doedsfallAaretFoer.beskrivelse'
                                )}
                                htmlSize={Bredde.S}
                            />
                        )}
                    </SkjemaElement>

                    <SkjemaGruppe>
                        <SkjemaElement>
                            <RHFValutaInput
                                name={'naeringsinntekt.norge.inntektIAar.aarsinntekt'}
                                label={t('inntektenDin.naeringsinntekt.inntektIAar.aarsinntekt')}
                                description={t('inntektenDin.loennsinntekt.inntektIAar.aarsinntekt.beskrivelse')}
                                htmlSize={Bredde.S}
                            />
                        </SkjemaElement>
                    </SkjemaGruppe>
                    {erMellomOktoberogDesember() && (
                        <SkjemaGruppe>
                            <RHFValutaInput
                                name={'naeringsinntekt.norge.inntektNesteAar.aarsinntekt'}
                                label={t('inntektenDin.naeringsinntekt.norge.inntektNesteAar.aarsinntekt')}
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
                        {doedsdatoErIAar(datoforDoedsfallet!!) ? (
                            <RHFValutaInput
                                name={'naeringsinntekt.utland.inntektIFjor.aarsinntekt'}
                                label={t('inntektenDin.naeringsinntekt.utland.inntektIFjor.aarsinntekt')}
                                description={t(
                                    'inntektenDin.naeringsinntekt.inntektIFjor.aarsinntekt.beskrivelse.utland'
                                )}
                                htmlSize={Bredde.S}
                            />
                        ) : (
                            <RHFValutaInput
                                name={'naeringsinntekt.utland.arbeidsinntektDoedsfallsaaret'}
                                label={t('inntektenDin.naeringsinntekt.inntektIFjor.aarsinntekt.doedsfallAaretFoer')}
                                description={t(
                                    'inntektenDin.naeringsinntekt.inntektIFjor.aarsinntekt.beskrivelse.utland'
                                )}
                                htmlSize={Bredde.S}
                            />
                        )}
                    </SkjemaElement>
                    <SkjemaGruppe>
                        <SkjemaElement>
                            <RHFValutaInput
                                name={'naeringsinntekt.utland.inntektIAar.aarsinntekt'}
                                label={t('inntektenDin.naeringsinntekt.inntektIAar.aarsinntekt')}
                                description={t('inntektenDin.loennsinntekt.inntektIAar.aarsinntekt.beskrivelse')}
                                htmlSize={Bredde.S}
                            />
                        </SkjemaElement>
                    </SkjemaGruppe>
                    {erMellomOktoberogDesember() && (
                        <SkjemaGruppe>
                            <RHFValutaInput
                                name={'naeringsinntekt.utland.inntektNesteAar.aarsinntekt'}
                                label={t('inntektenDin.naeringsinntekt.utland.inntektNesteAar.aarsinntekt')}
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
