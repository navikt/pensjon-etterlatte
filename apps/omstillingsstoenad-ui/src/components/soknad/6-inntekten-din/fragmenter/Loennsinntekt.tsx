import { useTranslation } from 'react-i18next'
import React from 'react'
import { Alert, BodyShort, Heading, ReadMore } from '@navikt/ds-react'
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
import { useBrukerContext } from '../../../../context/bruker/BrukerContext'

const Loennsinntekt = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<IInntekt>()
    const { state: soknadState } = useSoknadContext()
    const { state: bruker } = useBrukerContext()

    const datoforDoedsfallet = soknadState.omDenAvdoede.datoForDoedsfallet

    const norgeEllerUtland = watch('loennsinntekt.norgeEllerUtland')

    const foedt1963EllerTidligere = bruker.foedselsaar!! <= 1963

    const erIkkeDesember = new Date(datoforDoedsfallet!!).getMonth() !== 11

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
                    <SkjemaGruppe>
                        <Alert variant={'info'}>{t('inntektenDin.loennsinntekt.bruttoinntekt')}</Alert>
                    </SkjemaGruppe>

                    {doedsdatoErIAar(datoforDoedsfallet!!) ? (
                        <>
                            {foedt1963EllerTidligere && (
                                <SkjemaGruppe>
                                    <RHFValutaInput
                                        name={'loennsinntekt.norge.inntektIFjor.aarsinntekt'}
                                        label={t('inntektenDin.loennsinntekt.norge.inntektIFjor.aarsinntekt')}
                                        description={t(
                                            'inntektenDin.loennsinntekt.inntektIFjor.aarsinntekt.beskrivelse'
                                        )}
                                        htmlSize={Bredde.M}
                                    />
                                </SkjemaGruppe>
                            )}
                            <SkjemaGruppe>
                                <SkjemaElement>
                                    <RHFValutaInput
                                        name={'loennsinntekt.norge.inntektIAar.tilDoedsfall'}
                                        label={t('inntektenDin.loennsinntekt.norge.inntektIAar.tilDoedsfall')}
                                        description={t(
                                            'inntektenDin.loennsinntekt.inntektIAar.tilDoedsfall.beskrivelse'
                                        )}
                                        htmlSize={Bredde.M}
                                    />
                                </SkjemaElement>
                                <ReadMore
                                    header={t(
                                        'inntektenDin.loennsinntekt.inntektIAar.tilDoedsfall.hvorforSpoerVi.tittel'
                                    )}
                                >
                                    {t('inntektenDin.loennsinntekt.inntektIAar.tilDoedsfall.hvorforSpoerVi.innhold')}
                                </ReadMore>
                            </SkjemaGruppe>
                            {erIkkeDesember && (
                                <SkjemaGruppe>
                                    <RHFValutaInput
                                        name={'loennsinntekt.norge.inntektIAar.aarsinntekt'}
                                        label={t('inntektenDin.loennsinntekt.inntektIAar.aarsinntekt')}
                                        description={t(
                                            'inntektenDin.loennsinntekt.inntektIAar.aarsinntekt.beskrivelse'
                                        )}
                                        htmlSize={Bredde.M}
                                    />
                                </SkjemaGruppe>
                            )}
                            {erMellomOktoberogDesember() && (
                                <SkjemaElement>
                                    <RHFValutaInput
                                        name={'loennsinntekt.norge.inntektNesteAar.aarsinntekt'}
                                        label={t('inntektenDin.loennsinntekt.norge.inntektNesteAar.aarsinntekt')}
                                        description={t(
                                            'inntektenDin.loennsinntekt.inntektIAar.aarsinntekt.beskrivelse'
                                        )}
                                        htmlSize={Bredde.M}
                                    />
                                </SkjemaElement>
                            )}
                        </>
                    ) : (
                        <>
                            <SkjemaGruppe>
                                {erIkkeDesember && (
                                    <SkjemaGruppe>
                                        <RHFValutaInput
                                            name={'loennsinntekt.norge.inntektIFjor.tilDoedsfall'}
                                            label={t('inntektenDin.loennsinntekt.norge.inntektIFjor.tilDoedsfall')}
                                            description={t(
                                                'inntektenDin.loennsinntekt.inntektIFjor.tilDoedsfall.beskrivelse'
                                            )}
                                            htmlSize={Bredde.M}
                                        />
                                    </SkjemaGruppe>
                                )}
                                <SkjemaGruppe>
                                    <RHFValutaInput
                                        name={'loennsinntekt.norge.inntektIFjor.aarsinntekt'}
                                        label={t('inntektenDin.loennsinntekt.norge.inntektIFjor.aarsinntekt')}
                                        description={t(
                                            'inntektenDin.loennsinntekt.inntektIFjor.aarsinntekt.doedsfallIFjor.beskrivelse'
                                        )}
                                        htmlSize={Bredde.M}
                                    />
                                </SkjemaGruppe>
                                <SkjemaElement>
                                    <RHFValutaInput
                                        name={'loennsinntekt.norge.inntektIAar.aarsinntekt'}
                                        label={t('inntektenDin.loennsinntekt.inntektIAar.aarsinntekt')}
                                        description={t(
                                            'inntektenDin.loennsinntekt.inntektIAar.aarsinntekt.beskrivelse'
                                        )}
                                        htmlSize={Bredde.M}
                                    />
                                </SkjemaElement>
                            </SkjemaGruppe>
                        </>
                    )}
                </>
            )}

            {norgeEllerUtland?.length === 2 && <hr />}

            {norgeEllerUtland?.includes(NorgeOgUtland.utland) && (
                <>
                    <SkjemaElement>
                        <Heading size={'small'}>{t('inntektenDin.loennsinntekt.norgeEllerUtland.utland')}</Heading>
                    </SkjemaElement>
                    <SkjemaGruppe>
                        <Alert variant={'info'}>{t('inntektenDin.loennsinntekt.bruttoinntekt.utland')}</Alert>
                    </SkjemaGruppe>

                    {doedsdatoErIAar(datoforDoedsfallet!!) ? (
                        <>
                            {foedt1963EllerTidligere && (
                                <SkjemaGruppe>
                                    <RHFValutaInput
                                        name={'loennsinntekt.utland.inntektIFjor.aarsinntekt'}
                                        label={t('inntektenDin.loennsinntekt.utland.inntektIFjor.aarsinntekt')}
                                        description={t(
                                            'inntektenDin.loennsinntekt.inntektIFjor.aarsinntekt.beskrivelse.utland'
                                        )}
                                        htmlSize={Bredde.M}
                                    />
                                </SkjemaGruppe>
                            )}

                            <SkjemaGruppe>
                                <SkjemaElement>
                                    <RHFValutaInput
                                        name={'loennsinntekt.utland.inntektIAar.tilDoedsfall'}
                                        label={t('inntektenDin.loennsinntekt.utland.inntektIAar.tilDoedsfall')}
                                        description={t(
                                            'inntektenDin.loennsinntekt.inntektIAar.tilDoedsfall.beskrivelse'
                                        )}
                                        htmlSize={Bredde.M}
                                    />
                                </SkjemaElement>
                                <ReadMore
                                    header={t(
                                        'inntektenDin.loennsinntekt.inntektIAar.tilDoedsfall.hvorforSpoerVi.tittel'
                                    )}
                                >
                                    {t('inntektenDin.loennsinntekt.inntektIAar.tilDoedsfall.hvorforSpoerVi.innhold')}
                                </ReadMore>
                            </SkjemaGruppe>
                            {erIkkeDesember && (
                                <SkjemaGruppe>
                                    <RHFValutaInput
                                        name={'loennsinntekt.utland.inntektIAar.aarsinntekt'}
                                        label={t('inntektenDin.loennsinntekt.inntektIAar.aarsinntekt')}
                                        description={t(
                                            'inntektenDin.loennsinntekt.inntektIAar.aarsinntekt.beskrivelse'
                                        )}
                                        htmlSize={Bredde.M}
                                    />
                                </SkjemaGruppe>
                            )}
                            {erMellomOktoberogDesember() && (
                                <SkjemaElement>
                                    <RHFValutaInput
                                        name={'loennsinntekt.utland.inntektNesteAar.aarsinntekt'}
                                        label={t('inntektenDin.loennsinntekt.utland.inntektNesteAar.aarsinntekt')}
                                        description={t(
                                            'inntektenDin.loennsinntekt.inntektIAar.aarsinntekt.beskrivelse'
                                        )}
                                        htmlSize={Bredde.M}
                                    />
                                </SkjemaElement>
                            )}
                        </>
                    ) : (
                        <>
                            {foedt1963EllerTidligere && (
                                <SkjemaGruppe>
                                    <RHFValutaInput
                                        name={'loennsinntekt.utland.inntektAaretFoerDoedsfall'}
                                        label={t('inntektenDin.loennsinntekt.inntektAaretFoerDoedsfall')}
                                        description={t(
                                            'inntektenDin.loennsinntekt.inntektAaretFoerDoedsfall.beskrivelse'
                                        )}
                                        htmlSize={Bredde.M}
                                    />
                                </SkjemaGruppe>
                            )}
                            {erIkkeDesember && (
                                <SkjemaGruppe>
                                    <RHFValutaInput
                                        name={'loennsinntekt.utland.inntektIFjor.tilDoedsfall'}
                                        label={t('inntektenDin.loennsinntekt.utland.inntektIFjor.tilDoedsfall')}
                                        description={t(
                                            'inntektenDin.loennsinntekt.inntektIFjor.tilDoedsfall.beskrivelse'
                                        )}
                                        htmlSize={Bredde.M}
                                    />
                                </SkjemaGruppe>
                            )}
                            <SkjemaGruppe>
                                <RHFValutaInput
                                    name={'loennsinntekt.utland.inntektIFjor.aarsinntekt'}
                                    label={t('inntektenDin.loennsinntekt.utland.inntektIFjor.aarsinntekt')}
                                    description={t(
                                        'inntektenDin.loennsinntekt.inntektIFjor.aarsinntekt.doedsfallIFjor.beskrivelse'
                                    )}
                                    htmlSize={Bredde.M}
                                />
                            </SkjemaGruppe>
                            <SkjemaGruppe>
                                <RHFValutaInput
                                    name={'loennsinntekt.utland.inntektIAar.aarsinntekt'}
                                    label={t('inntektenDin.loennsinntekt.inntektIAar.aarsinntekt')}
                                    description={t('inntektenDin.loennsinntekt.inntektIAar.aarsinntekt.beskrivelse')}
                                    htmlSize={Bredde.M}
                                />
                            </SkjemaGruppe>
                        </>
                    )}
                </>
            )}

            {norgeEllerUtland?.length > 0 && (
                <>
                    <Alert variant={'info'}>{t('inntektenDin.loennsinntekt.info')}</Alert>
                    <EndringInntekt type={'loennsinntekt'} />
                </>
            )}
        </SkjemaGruppe>
    )
}

export default Loennsinntekt
