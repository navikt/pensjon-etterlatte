import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { RHFInput, RHFProsentInput } from '../../../felles/rhf/RHFInput'
import Datovelger from '../../../felles/Datovelger'
import { useTranslation } from 'react-i18next'
import { Detail, Heading, RadioProps } from '@navikt/ds-react'
import { useBrukerContext } from '../../../../context/bruker/BrukerContext'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'
import { IValg } from '../../../../typer/Spoersmaal'
import { SkjemaGruppeRad } from '../../../felles/StyledComponents'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { addYears } from 'date-fns'
import { RHFRadio, RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { Studieform } from '../../../../typer/utdanning'
import { useFormContext } from 'react-hook-form'
import { IMerOmSituasjonenDin } from '../../../../typer/situasjon'
import Bredde from '../../../../typer/bredde'

const UnderUtdanning = () => {
    const { t } = useTranslation()
    const { state } = useBrukerContext()
    const { watch } = useFormContext<IMerOmSituasjonenDin>()

    const studieform = watch('utdanning.naavaerendeUtdanning.studieform')

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <Heading size={'small'}>{t('merOmSituasjonenDin.utdanning.tittel')}</Heading>
            </SkjemaElement>

            <SkjemaElement>
                <RHFInput
                    name={'utdanning.naavaerendeUtdanning.studiested'}
                    label={t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.studiested')}
                    htmlSize={Bredde.M}
                />
            </SkjemaElement>
            <SkjemaElement>
                <RHFInput
                    name={'utdanning.naavaerendeUtdanning.studie'}
                    label={t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.studie')}
                    htmlSize={Bredde.M}
                />
            </SkjemaElement>

            <RHFRadio
                name={`utdanning.naavaerendeUtdanning.studieform` as const}
                legend={t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.studieform')}
            >
                {Object.values(Studieform).map((value) => {
                    return { children: t(value), value } as RadioProps
                })}
            </RHFRadio>
            {studieform === Studieform.deltid && (
                <SkjemaElement>
                    <RHFProsentInput
                        name={'utdanning.naavaerendeUtdanning.studieprosent'}
                        label={t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.studieprosent')}
                        description={t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.studieprosent.beskrivelse')}
                        htmlSize={Bredde.S}
                    />
                </SkjemaElement>
            )}
            <SkjemaElement>
                <SkjemaElement>
                    <Heading size={'small'}>{t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.studietsLengde')}</Heading>
                    <Detail textColor={'subtle'}>
                        {t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.studietsLengde.beskrivelse')}
                    </Detail>
                </SkjemaElement>
                <SkjemaGruppeRad>
                    <Datovelger
                        name={'utdanning.naavaerendeUtdanning.startDato'}
                        label={t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.startDato')}
                        minDate={state.foedselsdato}
                        maxDate={new Date()}
                    />

                    <Datovelger
                        name={'utdanning.naavaerendeUtdanning.sluttDato'}
                        label={t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.sluttDato')}
                        minDate={new Date()}
                        maxDate={addYears(new Date(), 10)}
                    />
                </SkjemaGruppeRad>
            </SkjemaElement>
            <SkjemaElement>
                <RHFSpoersmaalRadio
                    name={`utdanning.naavaerendeUtdanning.godkjentUtdanning` as const}
                    legend={t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.godkjentUtdanning')}
                    vetIkke
                />

            </SkjemaElement>
            <SkjemaElement>
                <br />
                <RHFCheckboksGruppe
                    name={'utdanning.soeknadOmSkolepenger'}
                    legend={t('merOmSituasjonenDin.utdanning.soeknadOmSkolepenger')}
                    description={t('merOmSituasjonenDin.utdanning.soeknadOmSkolepenger.beskrivelse')}
                    required={false}
                    checkboxes={[
                        {
                            children: t('merOmSituasjonenDin.utdanning.soeknadOmSkolepenger.bekreftelse'),
                            value: IValg.JA,
                        },
                    ]}
                />
            </SkjemaElement>

            <SkjemaElement>
                <RHFCheckboksGruppe
                    name={'utdanning.soeknadOmTilleggsstoenadUtdanning'}
                    legend={t('merOmSituasjonenDin.utdanning.soeknadOmTilleggsstoenadUtdanning')}
                    description={t('merOmSituasjonenDin.utdanning.soeknadOmTilleggsstoenadUtdanning.beskrivelse')}
                    required={false}
                    checkboxes={[
                        {
                            children: t('merOmSituasjonenDin.utdanning.soeknadOmTilleggsstoenadUtdanning.bekreftelse'),
                            value: IValg.JA,
                        },
                    ]}
                />
            </SkjemaElement>
        </SkjemaGruppe>
    )
}

export default UnderUtdanning
