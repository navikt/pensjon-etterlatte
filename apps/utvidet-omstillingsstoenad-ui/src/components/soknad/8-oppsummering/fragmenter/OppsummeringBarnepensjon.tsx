import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { IOmBarn } from '../../../../typer/person'
import { IValg } from '../../../../typer/Spoersmaal'
import { StegPath } from '../../../../typer/steg'
import { OppsummeringGruppe } from '../OppsummeringGruppe'
import { OppsummeringSeksjon } from '../OppsummeringSeksjon'
import PersonInfoOppsummering from './PersonInfoOppsummering'
import { TekstGruppe, TekstGruppeJaNeiVetIkke } from './TekstGruppe'
import UtbetalingsInformasjonOppsummering from './UtbetalingsInformasjonOppsummering'

interface Props {
    opplysningerOmBarn: IOmBarn
    senderSoeknad: boolean
}

export const OppsummeringBarnepensjon = memo(({ opplysningerOmBarn, senderSoeknad }: Props) => {
    const { t } = useTranslation()

    return (
        <OppsummeringSeksjon
            tittel={t('omBarn.tittel')}
            path={`/skjema/steg/${StegPath.OmBarn}`}
            pathText={StegPath.OmBarn}
            senderSoeknad={senderSoeknad}
        >
            {opplysningerOmBarn.barn?.map((barnet, index) => (
                <OppsummeringGruppe key={index} tittel={`${barnet.fornavn} ${barnet.etternavn}`}>
                    <PersonInfoOppsummering
                        fornavn={barnet.fornavn}
                        etternavn={barnet.etternavn}
                        fnrDnr={barnet.foedselsnummer}
                        foedselsdato={barnet.foedselsdato}
                        statsborgerskap={barnet.statsborgerskap}
                    />

                    <TekstGruppeJaNeiVetIkke
                        tittel={t('omBarn.bosattUtland.svar')}
                        innhold={barnet.bosattUtland?.svar}
                    />

                    {barnet.bosattUtland?.svar === IValg.JA && (
                        <>
                            <TekstGruppe tittel={t('omBarn.bosattUtland.land')} innhold={barnet.bosattUtland.land} />
                            <TekstGruppe
                                tittel={t('omBarn.bosattUtland.adresse')}
                                innhold={barnet.bosattUtland.adresse}
                            />
                        </>
                    )}

                    {barnet.harBarnetVerge?.svar && (
                        <TekstGruppeJaNeiVetIkke
                            tittel={t('omBarn.harBarnetVerge.svar')}
                            innhold={barnet.harBarnetVerge?.svar}
                        />
                    )}

                    {barnet.harBarnetVerge?.svar === IValg.JA && (
                        <>
                            {barnet.harBarnetVerge.fornavn && (
                                <TekstGruppe
                                    tittel={t('omBarn.harBarnetVerge.fornavn')}
                                    innhold={barnet.harBarnetVerge.fornavn}
                                />
                            )}
                            {barnet.harBarnetVerge.etternavn && (
                                <TekstGruppe
                                    tittel={t('omBarn.harBarnetVerge.etternavn')}
                                    innhold={barnet.harBarnetVerge.etternavn}
                                />
                            )}
                            {barnet.harBarnetVerge.foedselsnummer && (
                                <TekstGruppe
                                    tittel={t('omBarn.harBarnetVerge.foedselsnummer')}
                                    innhold={barnet.harBarnetVerge.foedselsnummer}
                                />
                            )}
                        </>
                    )}

                    {barnet.barnepensjon?.kontonummer?.svar && (
                        <TekstGruppeJaNeiVetIkke
                            tittel={t('omBarn.barnepensjon.kontonummer.svar')}
                            innhold={barnet.barnepensjon?.kontonummer?.svar}
                        />
                    )}

                    {barnet.barnepensjon?.kontonummer?.svar === IValg.NEI && (
                        <UtbetalingsInformasjonOppsummering
                            utbetalingsInformasjon={barnet.barnepensjon.utbetalingsInformasjon!}
                        />
                    )}

                    {barnet.barnepensjon?.soeker && (
                        <TekstGruppe
                            tittel={t('omBarn.barnepensjon.soeker')}
                            innhold={t('omBarn.barnepensjon.soekt')}
                        />
                    )}
                </OppsummeringGruppe>
            ))}

            {!opplysningerOmBarn.barn?.length && (
                <TekstGruppe tittel={t('omBarn.tittel')} innhold={t('omBarn.ikkeSoekt')} />
            )}
        </OppsummeringSeksjon>
    )
})
