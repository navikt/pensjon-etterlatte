import { Alert, BodyShort, Box, Heading, List, ReadMore } from '@navikt/ds-react'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useBrukerContext } from '../../../../context/bruker/BrukerContext'
import { useSoknadContext } from '../../../../context/soknad/SoknadContext'
import Bredde from '../../../../typer/bredde'
import { IInntekt, NorgeOgUtland } from '../../../../typer/inntekt'
import { doedsdatoErIAar, erMellomOktoberogDesember } from '../../../../utils/dato'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'
import { RHFValutaInput } from '../../../felles/rhf/RHFInput'
import { ListItemWithIndent } from '../../../felles/StyledComponents'
import EndringInntekt from './EndringInntekt'

const Loennsinntekt = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<IInntekt>()
    const { state: soknadState } = useSoknadContext()
    const { state: bruker } = useBrukerContext()

    const datoforDoedsfallet = soknadState.omDenAvdoede.datoForDoedsfallet

    const norgeEllerUtland = watch('loennsinntekt.norgeEllerUtland')

    const foedt1963EllerTidligere = bruker.foedselsaar! <= 1963

    const erIkkeDesember = new Date(datoforDoedsfallet!).getMonth() !== 11

    return (
        <Box marginBlock="0 12">
            <Box marginBlock="4">
                <Heading size={'medium'}>{t('inntektenDin.loennsinntekt.tittel')}</Heading>
                <BodyShort>{t('inntektenDin.loennsinntekt.ingress')}</BodyShort>
            </Box>

            <Box marginBlock="4">
                <ReadMore header={t('inntektenDin.loennsinntekt.hvaRegnesSominntekt.tittel')}>
                    {t('inntektenDin.loennsinntekt.hvaRegnesSominntekt.innhold')}
                    <List size={'small'}>
                        <ListItemWithIndent>
                            {t('inntektenDin.loennsinntekt.hvaRegnesSominntekt.innhold.li1')}
                        </ListItemWithIndent>
                        <ListItemWithIndent>
                            {t('inntektenDin.loennsinntekt.hvaRegnesSominntekt.innhold.li2')}
                        </ListItemWithIndent>
                        <ListItemWithIndent>
                            {t('inntektenDin.loennsinntekt.hvaRegnesSominntekt.innhold.li3')}
                        </ListItemWithIndent>
                        <ListItemWithIndent>
                            {t('inntektenDin.loennsinntekt.hvaRegnesSominntekt.innhold.li4')}
                        </ListItemWithIndent>
                        <ListItemWithIndent>
                            {t('inntektenDin.loennsinntekt.hvaRegnesSominntekt.innhold.li5')}
                        </ListItemWithIndent>
                    </List>
                </ReadMore>
            </Box>

            <Box marginBlock="4">
                <RHFCheckboksGruppe
                    name={'loennsinntekt.norgeEllerUtland'}
                    checkboxes={Object.values(NorgeOgUtland).map((value) => {
                        return { children: t(value), value, required: true }
                    })}
                    legend={t('inntektenDin.loennsinntekt.norgeEllerUtland')}
                />
            </Box>

            {norgeEllerUtland?.includes(NorgeOgUtland.norge) && (
                <>
                    <Box marginBlock="4">
                        <Heading size={'small'}>{t('inntektenDin.loennsinntekt.norgeEllerUtland.norge')}</Heading>
                    </Box>
                    <Box marginBlock="0 12">
                        <Alert variant={'info'}>{t('inntektenDin.loennsinntekt.bruttoinntekt')}</Alert>
                    </Box>

                    {doedsdatoErIAar(datoforDoedsfallet!) ? (
                        <>
                            {foedt1963EllerTidligere && (
                                <Box marginBlock="0 12">
                                    <RHFValutaInput
                                        name={'loennsinntekt.norge.inntektIFjor.aarsinntekt'}
                                        label={t('inntektenDin.loennsinntekt.norge.inntektIFjor.aarsinntekt')}
                                        description={t(
                                            'inntektenDin.loennsinntekt.inntektIFjor.aarsinntekt.beskrivelse'
                                        )}
                                        htmlSize={Bredde.S}
                                    />
                                </Box>
                            )}
                            <Box marginBlock="0 12">
                                <Box marginBlock="4">
                                    <RHFValutaInput
                                        name={'loennsinntekt.norge.inntektIAar.tilDoedsfall'}
                                        label={t('inntektenDin.loennsinntekt.norge.inntektIAar.tilDoedsfall')}
                                        description={t(
                                            'inntektenDin.loennsinntekt.inntektIAar.tilDoedsfall.beskrivelse'
                                        )}
                                        htmlSize={Bredde.S}
                                    />
                                </Box>
                                <ReadMore
                                    header={t(
                                        'inntektenDin.loennsinntekt.inntektIAar.tilDoedsfall.hvorforSpoerVi.tittel'
                                    )}
                                >
                                    {t('inntektenDin.loennsinntekt.inntektIAar.tilDoedsfall.hvorforSpoerVi.innhold')}
                                </ReadMore>
                            </Box>
                            {erIkkeDesember && (
                                <Box marginBlock="0 12">
                                    <RHFValutaInput
                                        name={'loennsinntekt.norge.inntektIAar.aarsinntekt'}
                                        label={t('inntektenDin.loennsinntekt.inntektIAar.aarsinntekt')}
                                        description={t(
                                            'inntektenDin.loennsinntekt.inntektIAar.aarsinntekt.beskrivelse'
                                        )}
                                        htmlSize={Bredde.S}
                                    />
                                </Box>
                            )}
                            {erMellomOktoberogDesember() && (
                                <Box marginBlock="4">
                                    <RHFValutaInput
                                        name={'loennsinntekt.norge.inntektNesteAar.aarsinntekt'}
                                        label={t('inntektenDin.loennsinntekt.norge.inntektNesteAar.aarsinntekt')}
                                        description={t(
                                            'inntektenDin.loennsinntekt.inntektIAar.aarsinntekt.beskrivelse'
                                        )}
                                        htmlSize={Bredde.S}
                                    />
                                </Box>
                            )}
                        </>
                    ) : (
                        <>
                            <Box marginBlock="0 12">
                                {erIkkeDesember && (
                                    <Box marginBlock="0 12">
                                        <RHFValutaInput
                                            name={'loennsinntekt.norge.inntektIFjor.tilDoedsfall'}
                                            label={t('inntektenDin.loennsinntekt.norge.inntektIFjor.tilDoedsfall')}
                                            description={t(
                                                'inntektenDin.loennsinntekt.inntektIFjor.tilDoedsfall.beskrivelse'
                                            )}
                                            htmlSize={Bredde.S}
                                        />
                                    </Box>
                                )}
                                <Box marginBlock="0 12">
                                    <RHFValutaInput
                                        name={'loennsinntekt.norge.inntektIFjor.aarsinntekt'}
                                        label={t('inntektenDin.loennsinntekt.norge.inntektIFjor.aarsinntekt')}
                                        description={t(
                                            'inntektenDin.loennsinntekt.inntektIFjor.aarsinntekt.doedsfallIFjor.beskrivelse'
                                        )}
                                        htmlSize={Bredde.S}
                                    />
                                </Box>
                                <Box marginBlock="4">
                                    <RHFValutaInput
                                        name={'loennsinntekt.norge.inntektIAar.aarsinntekt'}
                                        label={t('inntektenDin.loennsinntekt.inntektIAar.aarsinntekt')}
                                        description={t(
                                            'inntektenDin.loennsinntekt.inntektIAar.aarsinntekt.beskrivelse'
                                        )}
                                        htmlSize={Bredde.S}
                                    />
                                </Box>
                            </Box>
                        </>
                    )}
                </>
            )}

            {norgeEllerUtland?.length === 2 && <hr />}

            {norgeEllerUtland?.includes(NorgeOgUtland.utland) && (
                <>
                    <Box marginBlock="4">
                        <Heading size={'small'}>{t('inntektenDin.loennsinntekt.norgeEllerUtland.utland')}</Heading>
                    </Box>
                    <Box marginBlock="0 12">
                        <Alert variant={'info'}>{t('inntektenDin.loennsinntekt.bruttoinntekt.utland')}</Alert>
                    </Box>

                    {doedsdatoErIAar(datoforDoedsfallet!) ? (
                        <>
                            {foedt1963EllerTidligere && (
                                <Box marginBlock="0 12">
                                    <RHFValutaInput
                                        name={'loennsinntekt.utland.inntektIFjor.aarsinntekt'}
                                        label={t('inntektenDin.loennsinntekt.utland.inntektIFjor.aarsinntekt')}
                                        description={t(
                                            'inntektenDin.loennsinntekt.inntektIFjor.aarsinntekt.beskrivelse.utland'
                                        )}
                                        htmlSize={Bredde.S}
                                    />
                                </Box>
                            )}

                            <Box marginBlock="0 12">
                                <Box marginBlock="4">
                                    <RHFValutaInput
                                        name={'loennsinntekt.utland.inntektIAar.tilDoedsfall'}
                                        label={t('inntektenDin.loennsinntekt.utland.inntektIAar.tilDoedsfall')}
                                        description={t(
                                            'inntektenDin.loennsinntekt.inntektIAar.tilDoedsfall.beskrivelse'
                                        )}
                                        htmlSize={Bredde.S}
                                    />
                                </Box>
                                <ReadMore
                                    header={t(
                                        'inntektenDin.loennsinntekt.inntektIAar.tilDoedsfall.hvorforSpoerVi.tittel'
                                    )}
                                >
                                    {t('inntektenDin.loennsinntekt.inntektIAar.tilDoedsfall.hvorforSpoerVi.innhold')}
                                </ReadMore>
                            </Box>
                            {erIkkeDesember && (
                                <Box marginBlock="0 12">
                                    <RHFValutaInput
                                        name={'loennsinntekt.utland.inntektIAar.aarsinntekt'}
                                        label={t('inntektenDin.loennsinntekt.inntektIAar.aarsinntekt')}
                                        description={t(
                                            'inntektenDin.loennsinntekt.inntektIAar.aarsinntekt.beskrivelse'
                                        )}
                                        htmlSize={Bredde.S}
                                    />
                                </Box>
                            )}
                            {erMellomOktoberogDesember() && (
                                <Box marginBlock="4">
                                    <RHFValutaInput
                                        name={'loennsinntekt.utland.inntektNesteAar.aarsinntekt'}
                                        label={t('inntektenDin.loennsinntekt.utland.inntektNesteAar.aarsinntekt')}
                                        description={t(
                                            'inntektenDin.loennsinntekt.inntektIAar.aarsinntekt.beskrivelse'
                                        )}
                                        htmlSize={Bredde.S}
                                    />
                                </Box>
                            )}
                        </>
                    ) : (
                        <>
                            {foedt1963EllerTidligere && (
                                <Box marginBlock="0 12">
                                    <RHFValutaInput
                                        name={'loennsinntekt.utland.inntektAaretFoerDoedsfall'}
                                        label={t('inntektenDin.loennsinntekt.inntektAaretFoerDoedsfall')}
                                        description={t(
                                            'inntektenDin.loennsinntekt.inntektAaretFoerDoedsfall.beskrivelse'
                                        )}
                                        htmlSize={Bredde.S}
                                    />
                                </Box>
                            )}
                            {erIkkeDesember && (
                                <Box marginBlock="0 12">
                                    <RHFValutaInput
                                        name={'loennsinntekt.utland.inntektIFjor.tilDoedsfall'}
                                        label={t('inntektenDin.loennsinntekt.utland.inntektIFjor.tilDoedsfall')}
                                        description={t(
                                            'inntektenDin.loennsinntekt.inntektIFjor.tilDoedsfall.beskrivelse'
                                        )}
                                        htmlSize={Bredde.S}
                                    />
                                </Box>
                            )}
                            <Box marginBlock="0 12">
                                <RHFValutaInput
                                    name={'loennsinntekt.utland.inntektIFjor.aarsinntekt'}
                                    label={t('inntektenDin.loennsinntekt.utland.inntektIFjor.aarsinntekt')}
                                    description={t(
                                        'inntektenDin.loennsinntekt.inntektIFjor.aarsinntekt.doedsfallIFjor.beskrivelse'
                                    )}
                                    htmlSize={Bredde.S}
                                />
                            </Box>
                            <Box marginBlock="0 12">
                                <RHFValutaInput
                                    name={'loennsinntekt.utland.inntektIAar.aarsinntekt'}
                                    label={t('inntektenDin.loennsinntekt.inntektIAar.aarsinntekt')}
                                    description={t('inntektenDin.loennsinntekt.inntektIAar.aarsinntekt.beskrivelse')}
                                    htmlSize={Bredde.S}
                                />
                            </Box>
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
        </Box>
    )
}

export default Loennsinntekt
