import { useTranslation } from 'react-i18next'
import React from 'react'
import { Alert, BodyShort, Heading, ReadMore } from '@navikt/ds-react'
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
import JevntOpptjentNaeringsinntekt from './JevntOpptjentNaeringsinntekt'
import { useBrukerContext } from '../../../../context/bruker/BrukerContext'

const Naeringsinntekt = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<IInntekt>()
    const { state: soknadState } = useSoknadContext()
    const { state: bruker } = useBrukerContext()

    const datoforDoedsfallet = soknadState.omDenAvdoede.datoForDoedsfallet

    const norgeEllerUtland = watch('naeringsinntekt.norgeEllerUtland')

    const foedt1963EllerTidligere = bruker.foedselsaar!! <= 1963

    const erIkkeDesember = new Date(datoforDoedsfallet!!).getMonth() !== 11

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
                        <Alert variant={'info'}>{t('inntektenDin.naeringsinntekt.bruttoinntekt')}</Alert>
                    </SkjemaElement>
                    <SkjemaGruppe>
                        <JevntOpptjentNaeringsinntekt type={'norge'} />
                    </SkjemaGruppe>
                    <SkjemaElement>
                        {doedsdatoErIAar(datoforDoedsfallet!!) ? (
                            <>
                                {foedt1963EllerTidligere && (
                                    <SkjemaGruppe>
                                        <RHFValutaInput
                                            name={'naeringsinntekt.norge.inntektIFjor.aarsinntekt'}
                                            label={t('inntektenDin.naeringsinntekt.norge.inntektIFjor.aarsinntekt')}
                                            description={t(
                                                'inntektenDin.naeringsinntekt.inntektIFjor.aarsinntekt.beskrivelse'
                                            )}
                                            htmlSize={Bredde.S}
                                        />
                                    </SkjemaGruppe>
                                )}
                                <SkjemaGruppe>
                                    <RHFValutaInput
                                        name={'naeringsinntekt.norge.inntektIAar.tilDoedsfall'}
                                        label={t('inntektenDin.naeringsinntekt.norge.inntektIAar.tilDoedsfall')}
                                        description={t(
                                            'inntektenDin.naeringsinntekt.inntektIAar.tilDoedsfall.beskrivelse'
                                        )}
                                        htmlSize={Bredde.S}
                                    />
                                    <SkjemaElement>
                                        <ReadMore
                                            header={t(
                                                'inntektenDin.naeringsinntekt.inntektIAar.tilDoedsfall.hvorforSpoerVi.tittel'
                                            )}
                                        >
                                            {t(
                                                'inntektenDin.naeringsinntekt.inntektIAar.tilDoedsfall.hvorforSpoerVi.innhold'
                                            )}
                                        </ReadMore>
                                    </SkjemaElement>
                                </SkjemaGruppe>
                                {erIkkeDesember && (
                                    <SkjemaGruppe>
                                        <RHFValutaInput
                                            name={'naeringsinntekt.norge.inntektIAar.aarsinntekt'}
                                            label={t('inntektenDin.naeringsinntekt.inntektIAar.aarsinntekt')}
                                            description={t(
                                                'inntektenDin.naeringsinntekt.inntektIAar.aarsinntekt.beskrivelse'
                                            )}
                                            htmlSize={Bredde.S}
                                        />
                                    </SkjemaGruppe>
                                )}
                                {erMellomOktoberogDesember() && (
                                    <SkjemaGruppe>
                                        <RHFValutaInput
                                            name={'naeringsinntekt.norge.inntektNesteAar.aarsinntekt'}
                                            label={t('inntektenDin.naeringsinntekt.norge.inntektNesteAar.aarsinntekt')}
                                            description={t(
                                                'inntektenDin.naeringsinntekt.inntektIAar.aarsinntekt.beskrivelse'
                                            )}
                                            htmlSize={Bredde.S}
                                        />
                                    </SkjemaGruppe>
                                )}
                            </>
                        ) : (
                            <>
                                {erIkkeDesember && (
                                    <SkjemaGruppe>
                                        <RHFValutaInput
                                            name={'naeringsinntekt.norge.inntektIFjor.tilDoedsfall'}
                                            label={t('inntektenDin.naeringsinntekt.norge.inntektIFjor.tilDoedsfall')}
                                            description={t(
                                                'inntektenDin.naeringsinntekt.inntektIFjor.tilDoedsfall.beskrivelse'
                                            )}
                                            htmlSize={Bredde.S}
                                        />
                                    </SkjemaGruppe>
                                )}
                                <SkjemaGruppe>
                                    <RHFValutaInput
                                        name={'naeringsinntekt.norge.inntektIFjor.aarsinntekt'}
                                        label={t('inntektenDin.naeringsinntekt.norge.inntektIFjor.aarsinntekt')}
                                        description={t(
                                            'inntektenDin.naeringsinntekt.inntektIFjor.aarsinntekt.doedsfallAaretFoer.beskrivelse'
                                        )}
                                        htmlSize={Bredde.S}
                                    />
                                </SkjemaGruppe>
                                <SkjemaGruppe>
                                    <RHFValutaInput
                                        name={'naeringsinntekt.norge.inntektIAar.aarsinntekt'}
                                        label={t('inntektenDin.naeringsinntekt.inntektIAar.aarsinntekt')}
                                        description={t(
                                            'inntektenDin.naeringsinntekt.inntektIAar.aarsinntekt.beskrivelse'
                                        )}
                                        htmlSize={Bredde.S}
                                    />
                                </SkjemaGruppe>
                            </>
                        )}
                    </SkjemaElement>
                </>
            )}

            {norgeEllerUtland?.length === 2 && <hr />}

            {norgeEllerUtland?.includes(NorgeOgUtland.utland) && (
                <>
                    <SkjemaElement>
                        <Heading size={'small'}>{t('inntektenDin.naeringsinntekt.norgeEllerUtland.utland')}</Heading>
                    </SkjemaElement>
                    <SkjemaElement>
                        <Alert variant={'info'}>{t('inntektenDin.naeringsinntekt.bruttoinntekt.utland')}</Alert>
                    </SkjemaElement>
                    <SkjemaElement>
                        <JevntOpptjentNaeringsinntekt type={'utland'} />
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
