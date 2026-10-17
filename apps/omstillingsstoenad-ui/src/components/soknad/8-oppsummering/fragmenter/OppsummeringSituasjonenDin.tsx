import { FormSummary } from '@navikt/ds-react'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { ISituasjonenDin, Sivilstatus } from '../../../../typer/person'
import { IValg } from '../../../../typer/Spoersmaal'
import { StegLabelKey, StegPath } from '../../../../typer/steg'
import { OppsummeringSeksjon } from '../OppsummeringSeksjon'
import { OppsummeringUnderseksjon } from '../OppsummeringUnderseksjon'
import { TekstGruppe, TekstGruppeJaNeiVetIkke } from './TekstGruppe'

interface Props {
    situasjonenDin: ISituasjonenDin
    senderSoeknad: boolean
}

export const OppsummeringSituasjonenDin = memo(({ situasjonenDin, senderSoeknad }: Props) => {
    const { t } = useTranslation()

    return (
        <OppsummeringSeksjon
            tittel={t(StegLabelKey.SituasjonenDin)}
            path={`/skjema/steg/${StegPath.SituasjonenDin}`}
            pathText={StegPath.SituasjonenDin}
            senderSoeknad={senderSoeknad}
            medSvarliste={false}
        >
            <FormSummary.Answers>
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
            </FormSummary.Answers>

            <OppsummeringUnderseksjon tittel={t('situasjonenDin.omsorgForBarn.tittel')}>
                <TekstGruppeJaNeiVetIkke
                    tittel={t('situasjonenDin.omsorgMinstFemti')}
                    innhold={situasjonenDin.omsorgMinstFemti}
                />
                <TekstGruppeJaNeiVetIkke
                    tittel={t('situasjonenDin.gravidEllerNyligFoedt')}
                    innhold={situasjonenDin.gravidEllerNyligFoedt}
                />
            </OppsummeringUnderseksjon>

            <OppsummeringUnderseksjon tittel={t('situasjonenDin.oppholdUtenforNorge.tittel')}>
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
            </OppsummeringUnderseksjon>
        </OppsummeringSeksjon>
    )
})
