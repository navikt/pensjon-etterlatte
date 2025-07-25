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
import EndringInntekt from './EndringInntekt'
import JevntOpptjentNaeringsinntekt from './JevntOpptjentNaeringsinntekt'

const Naeringsinntekt = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<IInntekt>()
    const { state: soknadState } = useSoknadContext()
    const { state: bruker } = useBrukerContext()

    const datoforDoedsfallet = soknadState.omDenAvdoede.datoForDoedsfallet

    const norgeEllerUtland = watch('naeringsinntekt.norgeEllerUtland')

    const foedt1963EllerTidligere = bruker.foedselsaar! <= 1963

    const erIkkeDesember = new Date(datoforDoedsfallet!).getMonth() !== 11

    return (
        <Box marginBlock="0 12">
            <Box marginBlock="4">
                <Heading size={'medium'}>{t('inntektenDin.naeringsinntekt.tittel')}</Heading>
                <BodyShort>{t('inntektenDin.naeringsinntekt.ingress')}</BodyShort>
            </Box>

            <Box marginBlock="4">
                <ReadMore header={t('inntektenDin.naeringsinntekt.hvaRegnesSominntekt.tittel')}>
                    {t('inntektenDin.naeringsinntekt.hvaRegnesSominntekt.innhold')}
                    <Box marginInline="4 0">
                        <List size={'small'}>
                            <List.Item>{t('inntektenDin.naeringsinntekt.hvaRegnesSominntekt.innhold.li1')}</List.Item>
                            <List.Item>{t('inntektenDin.naeringsinntekt.hvaRegnesSominntekt.innhold.li2')}</List.Item>
                            <List.Item>{t('inntektenDin.naeringsinntekt.hvaRegnesSominntekt.innhold.li3')}</List.Item>
                            <List.Item>{t('inntektenDin.naeringsinntekt.hvaRegnesSominntekt.innhold.li4')}</List.Item>
                        </List>
                    </Box>
                </ReadMore>
            </Box>

            <Box marginBlock="4">
                <RHFCheckboksGruppe
                    name={'naeringsinntekt.norgeEllerUtland'}
                    checkboxes={Object.values(NorgeOgUtland).map((value) => {
                        return { children: t(value), value, required: true }
                    })}
                    legend={t('inntektenDin.naeringsinntekt.norgeEllerUtland')}
                />
            </Box>

            {norgeEllerUtland?.includes(NorgeOgUtland.norge) && (
                <>
                    <Box marginBlock="4">
                        <Heading size={'small'}>{t('inntektenDin.naeringsinntekt.norgeEllerUtland.norge')}</Heading>
                    </Box>
                    <Box marginBlock="4">
                        <Alert variant={'info'}>{t('inntektenDin.naeringsinntekt.bruttoinntekt')}</Alert>
                    </Box>
                    <Box marginBlock="0 12">
                        <JevntOpptjentNaeringsinntekt type={'norge'} />
                    </Box>
                    <Box marginBlock="4">
                        {doedsdatoErIAar(datoforDoedsfallet!) ? (
                            <>
                                {foedt1963EllerTidligere && (
                                    <Box marginBlock="0 12">
                                        <RHFValutaInput
                                            name={'naeringsinntekt.norge.inntektIFjor.aarsinntekt'}
                                            label={t('inntektenDin.naeringsinntekt.norge.inntektIFjor.aarsinntekt')}
                                            description={t(
                                                'inntektenDin.naeringsinntekt.inntektIFjor.aarsinntekt.beskrivelse'
                                            )}
                                            htmlSize={Bredde.S}
                                        />
                                    </Box>
                                )}
                                <Box marginBlock="0 12">
                                    <RHFValutaInput
                                        name={'naeringsinntekt.norge.inntektIAar.tilDoedsfall'}
                                        label={t('inntektenDin.naeringsinntekt.norge.inntektIAar.tilDoedsfall')}
                                        description={t(
                                            'inntektenDin.naeringsinntekt.inntektIAar.tilDoedsfall.beskrivelse'
                                        )}
                                        htmlSize={Bredde.S}
                                    />
                                    <Box marginBlock="4">
                                        <ReadMore
                                            header={t(
                                                'inntektenDin.naeringsinntekt.inntektIAar.tilDoedsfall.hvorforSpoerVi.tittel'
                                            )}
                                        >
                                            {t(
                                                'inntektenDin.naeringsinntekt.inntektIAar.tilDoedsfall.hvorforSpoerVi.innhold'
                                            )}
                                        </ReadMore>
                                    </Box>
                                </Box>
                                {erIkkeDesember && (
                                    <Box marginBlock="0 12">
                                        <RHFValutaInput
                                            name={'naeringsinntekt.norge.inntektIAar.aarsinntekt'}
                                            label={t('inntektenDin.naeringsinntekt.inntektIAar.aarsinntekt')}
                                            description={t(
                                                'inntektenDin.naeringsinntekt.inntektIAar.aarsinntekt.beskrivelse'
                                            )}
                                            htmlSize={Bredde.S}
                                        />
                                    </Box>
                                )}
                                {erMellomOktoberogDesember() && (
                                    <Box marginBlock="0 12">
                                        <RHFValutaInput
                                            name={'naeringsinntekt.norge.inntektNesteAar.aarsinntekt'}
                                            label={t('inntektenDin.naeringsinntekt.norge.inntektNesteAar.aarsinntekt')}
                                            description={t(
                                                'inntektenDin.naeringsinntekt.inntektIAar.aarsinntekt.beskrivelse'
                                            )}
                                            htmlSize={Bredde.S}
                                        />
                                    </Box>
                                )}
                            </>
                        ) : (
                            <>
                                {erIkkeDesember && (
                                    <Box marginBlock="0 12">
                                        <RHFValutaInput
                                            name={'naeringsinntekt.norge.inntektIFjor.tilDoedsfall'}
                                            label={t('inntektenDin.naeringsinntekt.norge.inntektIFjor.tilDoedsfall')}
                                            description={t(
                                                'inntektenDin.naeringsinntekt.inntektIFjor.tilDoedsfall.beskrivelse'
                                            )}
                                            htmlSize={Bredde.S}
                                        />
                                    </Box>
                                )}
                                <Box marginBlock="0 12">
                                    <RHFValutaInput
                                        name={'naeringsinntekt.norge.inntektIFjor.aarsinntekt'}
                                        label={t('inntektenDin.naeringsinntekt.norge.inntektIFjor.aarsinntekt')}
                                        description={t(
                                            'inntektenDin.naeringsinntekt.inntektIFjor.aarsinntekt.doedsfallAaretFoer.beskrivelse'
                                        )}
                                        htmlSize={Bredde.S}
                                    />
                                </Box>
                                <Box marginBlock="0 12">
                                    <RHFValutaInput
                                        name={'naeringsinntekt.norge.inntektIAar.aarsinntekt'}
                                        label={t('inntektenDin.naeringsinntekt.inntektIAar.aarsinntekt')}
                                        description={t(
                                            'inntektenDin.naeringsinntekt.inntektIAar.aarsinntekt.beskrivelse'
                                        )}
                                        htmlSize={Bredde.S}
                                    />
                                </Box>
                            </>
                        )}
                    </Box>
                </>
            )}

            {norgeEllerUtland?.length === 2 && <hr />}

            {norgeEllerUtland?.includes(NorgeOgUtland.utland) && (
                <>
                    <Box marginBlock="4">
                        <Heading size={'small'}>{t('inntektenDin.naeringsinntekt.norgeEllerUtland.utland')}</Heading>
                    </Box>
                    <Box marginBlock="4">
                        <Alert variant={'info'}>{t('inntektenDin.naeringsinntekt.bruttoinntekt.utland')}</Alert>
                    </Box>
                    <Box marginBlock="0 12">
                        <JevntOpptjentNaeringsinntekt type={'utland'} />
                    </Box>
                    <Box marginBlock="4">
                        {doedsdatoErIAar(datoforDoedsfallet!) ? (
                            <>
                                {foedt1963EllerTidligere && (
                                    <Box marginBlock="0 12">
                                        <RHFValutaInput
                                            name={'naeringsinntekt.utland.inntektIFjor.aarsinntekt'}
                                            label={t('inntektenDin.naeringsinntekt.utland.inntektIFjor.aarsinntekt')}
                                            description={t(
                                                'inntektenDin.naeringsinntekt.inntektIFjor.aarsinntekt.beskrivelse.utland'
                                            )}
                                            htmlSize={Bredde.S}
                                        />
                                    </Box>
                                )}
                                <>
                                    <RHFValutaInput
                                        name={'naeringsinntekt.utland.inntektIAar.tilDoedsfall'}
                                        label={t('inntektenDin.naeringsinntekt.utland.inntektIAar.tilDoedsfall')}
                                        description={t(
                                            'inntektenDin.naeringsinntekt.inntektIAar.tilDoedsfall.beskrivelse'
                                        )}
                                        htmlSize={Bredde.S}
                                    />
                                    <Box marginBlock="4">
                                        <ReadMore
                                            header={t(
                                                'inntektenDin.naeringsinntekt.inntektIAar.tilDoedsfall.hvorforSpoerVi.tittel'
                                            )}
                                        >
                                            {t(
                                                'inntektenDin.naeringsinntekt.inntektIAar.tilDoedsfall.hvorforSpoerVi.innhold'
                                            )}
                                        </ReadMore>
                                    </Box>
                                </>
                                {erIkkeDesember && (
                                    <Box marginBlock="0 12">
                                        <Box marginBlock="4">
                                            <RHFValutaInput
                                                name={'naeringsinntekt.utland.inntektIAar.aarsinntekt'}
                                                label={t('inntektenDin.naeringsinntekt.inntektIAar.aarsinntekt')}
                                                description={t(
                                                    'inntektenDin.naeringsinntekt.inntektIAar.aarsinntekt.beskrivelse'
                                                )}
                                                htmlSize={Bredde.S}
                                            />
                                        </Box>
                                    </Box>
                                )}
                                {erMellomOktoberogDesember() && (
                                    <Box marginBlock="0 12">
                                        <RHFValutaInput
                                            name={'naeringsinntekt.utland.inntektNesteAar.aarsinntekt'}
                                            label={t('inntektenDin.naeringsinntekt.utland.inntektNesteAar.aarsinntekt')}
                                            description={t(
                                                'inntektenDin.naeringsinntekt.inntektIAar.aarsinntekt.beskrivelse'
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
                                            name={'naeringsinntekt.utland.inntektAaretFoerDoedsfall'}
                                            label={t('inntektenDin.naeringsinntekt.inntektAaretFoerDoedsfall')}
                                            description={t(
                                                'inntektenDin.naeringsinntekt.inntektAaretFoerDoedsfall.beskrivelse'
                                            )}
                                            htmlSize={Bredde.S}
                                        />
                                    </Box>
                                )}
                                {erIkkeDesember && (
                                    <Box marginBlock="0 12">
                                        <RHFValutaInput
                                            name={'naeringsinntekt.utland.inntektIFjor.tilDoedsfall'}
                                            label={t('inntektenDin.naeringsinntekt.utland.inntektIFjor.tilDoedsfall')}
                                            description={t(
                                                'inntektenDin.naeringsinntekt.inntektIFjor.tilDoedsfall.beskrivelse'
                                            )}
                                            htmlSize={Bredde.S}
                                        />
                                    </Box>
                                )}
                                <Box marginBlock="0 12">
                                    <RHFValutaInput
                                        name={'naeringsinntekt.utland.inntektIFjor.aarsinntekt'}
                                        label={t('inntektenDin.naeringsinntekt.utland.inntektIFjor.aarsinntekt')}
                                        description={t(
                                            'inntektenDin.naeringsinntekt.inntektIFjor.aarsinntekt.beskrivelse.utland'
                                        )}
                                        htmlSize={Bredde.S}
                                    />
                                </Box>
                                <Box marginBlock="0 12">
                                    <Box marginBlock="4">
                                        <RHFValutaInput
                                            name={'naeringsinntekt.utland.inntektIAar.aarsinntekt'}
                                            label={t('inntektenDin.naeringsinntekt.inntektIAar.aarsinntekt')}
                                            description={t(
                                                'inntektenDin.naeringsinntekt.inntektIAar.aarsinntekt.beskrivelse'
                                            )}
                                            htmlSize={Bredde.S}
                                        />
                                    </Box>
                                </Box>
                            </>
                        )}
                    </Box>
                </>
            )}

            {norgeEllerUtland?.length > 0 && (
                <>
                    <Alert variant={'info'}>{t('inntektenDin.naeringsinntekt.info')}</Alert>
                    <EndringInntekt type={'naeringsinntekt'} />
                </>
            )}
        </Box>
    )
}

export default Naeringsinntekt
