import { SkjemaGruppe } from '../../felles/SkjemaGruppe'
import { RHFCheckboksGruppe } from '../../felles/rhf/RHFCheckboksPanelGruppe'
import { IValg } from '../../../typer/Spoersmaal'
import React from 'react'
import { ISoeknad } from '../../../context/soknad/soknad'
import { useTranslation } from 'react-i18next'
import { JobbStatus } from '../../../typer/situasjon'
import { IBarn } from '../../../typer/person'
import { IngenJobb } from '../../../typer/arbeidsforhold'

const AndreStoenader = ({ soeknad, barn }: { soeknad: ISoeknad; barn?: IBarn[] }) => {
    const { t } = useTranslation()
    const situasjon = soeknad.dinSituasjon

    const erArbeidstaker = situasjon.arbeidsforhold || situasjon.selvstendig
    const erArbeidssoeker = situasjon.jobbStatus?.includes(JobbStatus.arbeidssoeker)
    const erSyk = situasjon.annenSituasjon?.beskrivelse === IngenJobb.syk
    const underUtdanning = situasjon.utdanning?.naavaerendeUtdanning
    const harBarn = (barn && barn.length > 0) || false

    const rettTilBarnetilsyn = harBarn && (erArbeidstaker || erSyk)
    const rettTilBarnStoenad = harBarn && (underUtdanning || erArbeidssoeker)

    return (
        <>
            {rettTilBarnetilsyn && (
                <SkjemaGruppe>
                    <RHFCheckboksGruppe
                        name={'soeknadOmBarnetilsyn'}
                        legend={t('omBarn.soeknadOmBarnetilsyn')}
                        description={t('omBarn.soeknadOmBarnetilsyn.beskrivelse')}
                        required={false}
                        checkboxes={[
                            {
                                children: t('omBarn.soeknadOmBarnetilsyn.bekreftelse'),
                                value: IValg.JA,
                            },
                        ]}
                    />
                </SkjemaGruppe>
            )}

            {rettTilBarnStoenad && (
                <SkjemaGruppe>
                    <RHFCheckboksGruppe
                        name={'soeknadOmTilleggsstoenadBarnepass'}
                        legend={t('omBarn.soeknadOmTilleggsstoenadBarnepass')}
                        description={t('omBarn.soeknadOmTilleggsstoenadBarnepass.beskrivelse')}
                        required={false}
                        checkboxes={[
                            {
                                children: t('omBarn.soeknadOmTilleggsstoenadBarnepass.bekreftelse'),
                                value: IValg.JA,
                            },
                        ]}
                    />
                </SkjemaGruppe>
            )}
        </>
    )
}

export default AndreStoenader
