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

const Naeringsinntekt = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<IInntekt>()

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
                        <RHFValutaInput
                            name={'naeringsinntekt.norge.arbeidsinntektAaretFoer'}
                            label={t('inntektenDin.naeringsinntekt.arbeidsinntektAaretFoer')}
                            description={t('inntektenDin.naeringsinntekt.arbeidsinntektAaretFoer.beskrivelse')}
                            htmlSize={Bredde.S}
                        />
                    </SkjemaElement>
                    <SkjemaGruppe>
                        <SkjemaElement>
                            <RHFValutaInput
                                name={'naeringsinntekt.norge.arbeidsinntektIAar.tilDoedsfall'}
                                label={t('inntektenDin.naeringsinntekt.arbeidsinntektIAar.tilDoedsfall')}
                                htmlSize={Bredde.S}
                            />
                        </SkjemaElement>
                        <SkjemaElement>
                            <RHFValutaInput
                                name={'naeringsinntekt.norge.arbeidsinntektIAar.etterDoedsfall'}
                                label={t('inntektenDin.naeringsinntekt.arbeidsinntektIAar.etterDoedsfall')}
                                htmlSize={Bredde.S}
                            />
                        </SkjemaElement>
                    </SkjemaGruppe>
                </>
            )}

            {norgeEllerUtland?.length === 2 && <hr />}

            {norgeEllerUtland?.includes(NorgeOgUtland.utland) && (
                <>
                    <SkjemaElement>
                        <Heading size={'small'}>{t('inntektenDin.naeringsinntekt.norgeEllerUtland.utland')}</Heading>
                    </SkjemaElement>
                    <SkjemaElement>
                        <RHFValutaInput
                            name={'naeringsinntekt.utland.arbeidsinntektAaretFoer'}
                            label={t('inntektenDin.naeringsinntekt.arbeidsinntektAaretFoer')}
                            description={t('inntektenDin.naeringsinntekt.arbeidsinntektAaretFoer.beskrivelse.utland')}
                            htmlSize={Bredde.S}
                        />
                    </SkjemaElement>
                    <SkjemaGruppe>
                        <SkjemaElement>
                            <RHFValutaInput
                                name={'naeringsinntekt.utland.arbeidsinntektIAar.tilDoedsfall'}
                                label={t('inntektenDin.naeringsinntekt.arbeidsinntektIAar.tilDoedsfall')}
                                htmlSize={Bredde.S}
                            />
                        </SkjemaElement>
                        <SkjemaElement>
                            <RHFValutaInput
                                name={'naeringsinntekt.utland.arbeidsinntektIAar.etterDoedsfall'}
                                label={t('inntektenDin.naeringsinntekt.arbeidsinntektIAar.etterDoedsfall')}
                                htmlSize={Bredde.S}
                            />
                        </SkjemaElement>
                    </SkjemaGruppe>
                </>
            )}

            <Alert variant={'info'}>{t('inntektenDin.naeringsinntekt.info')}</Alert>

            <EndringInntekt type={'naeringsinntekt'} />
        </SkjemaGruppe>
    )
}

export default Naeringsinntekt
