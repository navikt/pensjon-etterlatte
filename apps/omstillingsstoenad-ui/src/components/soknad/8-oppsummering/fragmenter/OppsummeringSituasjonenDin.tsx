import { Heading, Panel } from '@navikt/ds-react'
import { memo } from 'react'
import { AccordionItem } from '../AccordionItem'
import { ISituasjonenDin, Sivilstatus } from '../../../../typer/person'
import { useTranslation } from 'react-i18next'
import { StegLabelKey, StegPath } from '../../../../typer/steg'
import { TekstGruppe, TekstGruppeJaNeiVetIkke } from './TekstGruppe'
import { IValg } from '../../../../typer/Spoersmaal'

interface Props {
    situasjonenDin: ISituasjonenDin
}

export const OppsummeringSituasjonenDin = memo(({ situasjonenDin }: Props) => {
    const { t } = useTranslation()

    return (
        <AccordionItem
            tittel={t(StegLabelKey.SituasjonenDin)}
            path={`/skjema/steg/${StegPath.SituasjonenDin}`}
            pathText={t(StegLabelKey.SituasjonenDin)}
        >
            <Panel>
                {situasjonenDin.nySivilstatus?.sivilstatus && (
                    <TekstGruppe
                        tittel={t('situasjonenDin.nySivilstatus.sivilstatus')}
                        innhold={t(situasjonenDin.nySivilstatus?.sivilstatus)}
                    />
                )}

                {situasjonenDin?.nySivilstatus?.sivilstatus === Sivilstatus.samboerskap && (
                    <>
                        <TekstGruppe
                            tittel={t('situasjonenDin.nySivilstatus.samboerskap.samboer.fornavn')}
                            innhold={situasjonenDin.nySivilstatus.samboerskap?.samboer?.fornavn}
                        />
                        <TekstGruppe
                            tittel={t('situasjonenDin.nySivilstatus.samboerskap.samboer.etternavn')}
                            innhold={situasjonenDin.nySivilstatus.samboerskap?.samboer?.etternavn}
                        />
                        <TekstGruppe
                            tittel={t('situasjonenDin.nySivilstatus.samboerskap.samboer.foedselsnummer')}
                            innhold={situasjonenDin.nySivilstatus.samboerskap?.samboer?.foedselsnummer}
                        />
                        <TekstGruppeJaNeiVetIkke
                            tittel={t('situasjonenDin.nySivilstatus.samboerskap.hattBarnEllerVaertGift')}
                            innhold={situasjonenDin.nySivilstatus.samboerskap?.hattBarnEllerVaertGift}
                        />
                    </>
                )}
            </Panel>

            <Panel>
                <Heading size={'small'}>{t('situasjonenDin.omsorgForBarn.tittel')}</Heading>
                <TekstGruppeJaNeiVetIkke
                    tittel={t('situasjonenDin.omsorgMinstFemti')}
                    innhold={situasjonenDin.omsorgMinstFemti}
                />
                <TekstGruppeJaNeiVetIkke
                    tittel={t('situasjonenDin.gravidEllerNyligFoedt')}
                    innhold={situasjonenDin.gravidEllerNyligFoedt}
                />
            </Panel>

            <Panel>
                <Heading size={'small'}>{t('situasjonenDin.oppholdUtenforNorge.tittel')}</Heading>
                <TekstGruppeJaNeiVetIkke
                    tittel={t('situasjonenDin.bosattINorge')}
                    innhold={situasjonenDin.bosattINorge}
                />

                {situasjonenDin.bosattINorge === IValg.JA && (
                    <>
                        <TekstGruppeJaNeiVetIkke
                            tittel={t('situasjonenDin.oppholderSegIUtlandet.svar')}
                            innhold={situasjonenDin.oppholderSegIUtlandet?.svar}
                        />
                        {situasjonenDin.oppholderSegIUtlandet?.svar === IValg.JA && (
                            <>
                                <TekstGruppe
                                    tittel={t('situasjonenDin.oppholderSegIUtlandet.oppholdsland')}
                                    innhold={situasjonenDin.oppholderSegIUtlandet.oppholdsland}
                                />
                                {situasjonenDin.oppholderSegIUtlandet.oppholdFra && (
                                    <TekstGruppe
                                        tittel={t('situasjonenDin.oppholderSegIUtlandet.oppholdFra')}
                                        innhold={situasjonenDin.oppholderSegIUtlandet.oppholdFra}
                                    />
                                )}
                                {situasjonenDin.oppholderSegIUtlandet.oppholdTil && (
                                    <TekstGruppe
                                        tittel={t('situasjonenDin.oppholderSegIUtlandet.oppholdTil')}
                                        innhold={situasjonenDin.oppholderSegIUtlandet.oppholdTil}
                                    />
                                )}
                            </>
                        )}
                    </>
                )}

                {situasjonenDin.bosattINorge === IValg.NEI && (
                    <TekstGruppe tittel={t('situasjonenDin.bosattLand')} innhold={situasjonenDin.bosattLand} />
                )}
            </Panel>
        </AccordionItem>
    )
})
