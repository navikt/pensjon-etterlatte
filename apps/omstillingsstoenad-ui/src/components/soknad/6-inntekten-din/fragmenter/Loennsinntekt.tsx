import { useTranslation } from 'react-i18next'
import React from 'react'
import { Alert, BodyShort, Heading } from '@navikt/ds-react'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { RHFValutaInput } from '../../../felles/rhf/RHFInput'
import Bredde from '../../../../typer/bredde'
import EndringInntekt from './EndringInntekt'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'
import { IInntekt, NorgeOgUtland } from '../../../../typer/inntekt'
import { useFormContext } from 'react-hook-form'
import { doedsdatoErIAar, erMellomOktoberogDesember } from '../../../../utils/dato'
import { useSoknadContext } from '../../../../context/soknad/SoknadContext'

const Loennsinntekt = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<IInntekt>()
    const { state: soknadState } = useSoknadContext()

    const datoforDoedsfallet = soknadState.omDenAvdoede.datoForDoedsfallet

    const norgeEllerUtland = watch('loennsinntekt.norgeEllerUtland')

    const erJanuar = new Date(datoforDoedsfallet!!).getMonth() === 0

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <Heading size={'medium'}>{t('inntektenDin.loennsinntekt.tittel')}</Heading>
                <BodyShort>{t('inntektenDin.loennsinntekt.ingress')}</BodyShort>
            </SkjemaElement>

            <SkjemaElement>
                <RHFCheckboksGruppe
                    name={'loennsinntekt.norgeEllerUtland'}
                    checkboxes={Object.values(NorgeOgUtland).map((value) => {
                        return { children: t(value), value, required: true }
                    })}
                    legend={t('inntektenDin.loennsinntekt.norgeEllerUtland')}
                />
            </SkjemaElement>

            {norgeEllerUtland?.includes(NorgeOgUtland.norge) && (
                <>
                    <SkjemaElement>
                        <Heading size={'small'}>{t('inntektenDin.loennsinntekt.norgeEllerUtland.norge')}</Heading>
                    </SkjemaElement>
                    {doedsdatoErIAar(datoforDoedsfallet!!) ? (
                        <>
                            <SkjemaGruppe>
                                <RHFValutaInput
                                    name={'loennsinntekt.norge.arbeidsinntektAaretFoer'}
                                    label={t('inntektenDin.loennsinntekt.norge.arbeidsinntektAaretFoer')}
                                    description={t('inntektenDin.loennsinntekt.arbeidsinntektAaretFoer.beskrivelse')}
                                    htmlSize={Bredde.S}
                                />
                            </SkjemaGruppe>
                            <SkjemaGruppe>
                                <SkjemaElement>
                                    <RHFValutaInput
                                        name={'loennsinntekt.norge.arbeidsinntektIAar.tilDoedsfall'}
                                        label={t('inntektenDin.loennsinntekt.norge.arbeidsinntektIAar.tilDoedsfall')}
                                        description={
                                            erJanuar
                                                ? t(
                                                      'inntektenDin.loennsinntekt.arbeidsinntektIAar.tilDoedsfall.beskrivelse.januar'
                                                  )
                                                : t(
                                                      'inntektenDin.loennsinntekt.arbeidsinntektIAar.tilDoedsfall.beskrivelse'
                                                  )
                                        }
                                        htmlSize={Bredde.S}
                                    />
                                </SkjemaElement>
                            </SkjemaGruppe>
                            <SkjemaGruppe>
                                <SkjemaElement>
                                    <RHFValutaInput
                                        name={'loennsinntekt.norge.arbeidsinntektIAar.etterDoedsfall'}
                                        label={t('inntektenDin.loennsinntekt.norge.arbeidsinntektIAar.etterDoedsfall')}
                                        description={t(
                                            'inntektenDin.loennsinntekt.arbeidsinntektIAar.etterDoedsfall.beskrivelse'
                                        )}
                                        htmlSize={Bredde.S}
                                    />
                                </SkjemaElement>
                            </SkjemaGruppe>
                        </>
                    ) : (
                        <>
                            <SkjemaGruppe>
                                <RHFValutaInput
                                    name={'loennsinntekt.norge.arbeidsinntektDoedsfallsaaret'}
                                    label={t('inntektenDin.loennsinntekt.arbeidsinntektAaretFoer.doedsfallAaretFoer')}
                                    description={t(
                                        'inntektenDin.loennsinntekt.arbeidsinntektAaretFoer.doedsfallAaretFoer.beskrivelse'
                                    )}
                                    htmlSize={Bredde.S}
                                />
                            </SkjemaGruppe>
                            <SkjemaGruppe>
                                <SkjemaElement>
                                    <RHFValutaInput
                                        name={'loennsinntekt.norge.inntektEtterDoedsfall'}
                                        label={t('inntektenDin.loennsinntekt.inntektEtterDoedsfall')}
                                        description={t('inntektenDin.loennsinntekt.inntektEtterDoedsfall.beskrivelse')}
                                        htmlSize={Bredde.S}
                                    />
                                </SkjemaElement>
                                <SkjemaElement>
                                    <RHFValutaInput
                                        name={'loennsinntekt.norge.arbeidsinntektIAar.aarsinntekt'}
                                        label={t('inntektenDin.loennsinntekt.arbeidsinntektIAar.aarsinntekt')}
                                        description={t(
                                            'inntektenDin.loennsinntekt.arbeidsinntektIAar.aarsinntekt.beskrivelse'
                                        )}
                                        htmlSize={Bredde.S}
                                    />
                                </SkjemaElement>
                            </SkjemaGruppe>
                        </>
                    )}
                    {erMellomOktoberogDesember() && (
                        <SkjemaElement>
                            <RHFValutaInput
                                name={'loennsinntekt.norge.arbeidsinntektIAar.etterDoedsfall'}
                                label={t('inntektenDin.loennsinntekt.norge.arbeidsinntektIAar.etterDoedsfall')}
                                htmlSize={Bredde.S}
                            />
                        </SkjemaElement>
                    )}
                </>
            )}

            {norgeEllerUtland?.length === 2 && <hr />}

            {norgeEllerUtland?.includes(NorgeOgUtland.utland) && (
                <>
                    <SkjemaElement>
                        <Heading size={'small'}>{t('inntektenDin.loennsinntekt.norgeEllerUtland.utland')}</Heading>
                    </SkjemaElement>
                    {doedsdatoErIAar(datoforDoedsfallet!!) ? (
                        <>
                            <SkjemaGruppe>
                                <RHFValutaInput
                                    name={'loennsinntekt.utland.arbeidsinntektAaretFoer'}
                                    label={t('inntektenDin.loennsinntekt.utland.arbeidsinntektAaretFoer')}
                                    description={t(
                                        'inntektenDin.loennsinntekt.arbeidsinntektAaretFoer.beskrivelse.utland'
                                    )}
                                    htmlSize={Bredde.S}
                                />
                            </SkjemaGruppe>

                            <SkjemaGruppe>
                                <SkjemaElement>
                                    <RHFValutaInput
                                        name={'loennsinntekt.utland.arbeidsinntektIAar.tilDoedsfall'}
                                        label={t('inntektenDin.loennsinntekt.utland.arbeidsinntektIAar.tilDoedsfall')}
                                        description={
                                            erJanuar
                                                ? t(
                                                      'inntektenDin.loennsinntekt.arbeidsinntektIAar.tilDoedsfall.beskrivelse.januar'
                                                  )
                                                : t(
                                                      'inntektenDin.loennsinntekt.arbeidsinntektIAar.tilDoedsfall.beskrivelse'
                                                  )
                                        }
                                        htmlSize={Bredde.S}
                                    />
                                </SkjemaElement>
                            </SkjemaGruppe>
                            <SkjemaGruppe>
                                <SkjemaElement>
                                    <RHFValutaInput
                                        name={'loennsinntekt.norge.arbeidsinntektIAar.etterDoedsfall'}
                                        label={t('inntektenDin.loennsinntekt.norge.arbeidsinntektIAar.etterDoedsfall')}
                                        description={t(
                                            'inntektenDin.loennsinntekt.arbeidsinntektIAar.etterDoedsfall.beskrivelse'
                                        )}
                                        htmlSize={Bredde.S}
                                    />
                                </SkjemaElement>
                            </SkjemaGruppe>
                        </>
                    ) : (
                        <>
                            <SkjemaGruppe>
                                <RHFValutaInput
                                    name={'loennsinntekt.utland.arbeidsinntektDoedsfallsaaret'}
                                    label={t('inntektenDin.loennsinntekt.arbeidsinntektAaretFoer.doedsfallAaretFoer')}
                                    description={t(
                                        'inntektenDin.loennsinntekt.arbeidsinntektAaretFoer.doedsfallAaretFoer.beskrivelse.utland'
                                    )}
                                    htmlSize={Bredde.S}
                                />
                            </SkjemaGruppe>
                            <SkjemaGruppe>
                                <SkjemaElement>
                                    <RHFValutaInput
                                        name={'loennsinntekt.utland.inntektEtterDoedsfall'}
                                        label={t('inntektenDin.loennsinntekt.inntektEtterDoedsfall')}
                                        description={t('inntektenDin.loennsinntekt.inntektEtterDoedsfall.beskrivelse')}
                                        htmlSize={Bredde.S}
                                    />
                                </SkjemaElement>
                                <SkjemaElement>
                                    <RHFValutaInput
                                        name={'loennsinntekt.utland.arbeidsinntektIAar.aarsinntekt'}
                                        label={t('inntektenDin.loennsinntekt.arbeidsinntektIAar.aarsinntekt')}
                                        description={t(
                                            'inntektenDin.loennsinntekt.arbeidsinntektIAar.aarsinntekt.beskrivelse'
                                        )}
                                        htmlSize={Bredde.S}
                                    />
                                </SkjemaElement>
                            </SkjemaGruppe>
                        </>
                    )}
                    {erMellomOktoberogDesember() && (
                        <SkjemaElement>
                            <RHFValutaInput
                                name={'loennsinntekt.utland.arbeidsinntektIAar.etterDoedsfall'}
                                label={t('inntektenDin.loennsinntekt.utland.arbeidsinntektIAar.etterDoedsfall')}
                                htmlSize={Bredde.S}
                            />
                        </SkjemaElement>
                    )}
                </>
            )}
            <Alert variant={'info'}>{t('inntektenDin.loennsinntekt.info')}</Alert>

            <EndringInntekt type={'loennsinntekt'} />
        </SkjemaGruppe>
    )
}

export default Loennsinntekt
