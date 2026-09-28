import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { IAvdoed } from '../../../../typer/person'
import { StegLabelKey, StegPath } from '../../../../typer/steg'
import { OppsummeringGruppe } from '../OppsummeringGruppe'
import { OppsummeringSeksjon } from '../OppsummeringSeksjon'
import PersonInfoOppsummering from './PersonInfoOppsummering'
import { TekstGruppe, TekstGruppeJaNeiVetIkke } from './TekstGruppe'

interface Props {
    omDenAvdoede: IAvdoed
    senderSoeknad: boolean
}

export const OppsummeringOmDenAvdoede = memo(({ omDenAvdoede, senderSoeknad }: Props) => {
    const { t } = useTranslation()

    return (
        <OppsummeringSeksjon
            tittel={t(StegLabelKey.OmAvdoed)}
            path={`/skjema/steg/${StegPath.OmAvdoed}`}
            pathText={StegPath.OmAvdoed}
            senderSoeknad={senderSoeknad}
        >
            <OppsummeringGruppe tittel={t('omDeg.undertittel.personalia')}>
                <PersonInfoOppsummering
                    fornavn={omDenAvdoede.fornavn}
                    etternavn={omDenAvdoede.etternavn}
                    fnrDnr={omDenAvdoede.foedselsnummer}
                    foedselsdato={omDenAvdoede.foedselsdato}
                    statsborgerskap={omDenAvdoede.statsborgerskap}
                />
                <TekstGruppe tittel={t('omDenAvdoede.datoForDoedsfallet')} innhold={omDenAvdoede.datoForDoedsfallet} />

                <TekstGruppeJaNeiVetIkke
                    tittel={t('omDenAvdoede.doedsfallAarsak')}
                    innhold={omDenAvdoede.doedsfallAarsak}
                />
            </OppsummeringGruppe>

            <TekstGruppeJaNeiVetIkke
                tittel={t('omDenAvdoede.boddEllerJobbetUtland.svar')}
                innhold={omDenAvdoede.boddEllerJobbetUtland?.svar}
            />
            {omDenAvdoede.boddEllerJobbetUtland?.oppholdUtland?.map((opphold, index) => (
                <OppsummeringGruppe key={index} tittel={`Opphold i ${opphold.land}`}>
                    <TekstGruppe
                        tittel={t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.land')}
                        innhold={opphold.land}
                    />
                    <TekstGruppe
                        tittel={t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.beskrivelse')}
                        innhold={opphold.beskrivelse?.map((item) => ` ${t(item)}`)}
                    />
                    {opphold.fraDato && (
                        <TekstGruppe
                            tittel={t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.fraDato')}
                            innhold={opphold.fraDato}
                        />
                    )}
                    {opphold.tilDato && (
                        <TekstGruppe
                            tittel={t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.tilDato')}
                            innhold={opphold.tilDato}
                        />
                    )}
                    <TekstGruppeJaNeiVetIkke
                        tittel={t('omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.medlemFolketrygd')}
                        innhold={opphold.medlemFolketrygd}
                    />

                    {opphold.mottokPensjon?.beloep && (
                        <TekstGruppe tittel={t('felles.aarligBeloep')} innhold={opphold.mottokPensjon.beloep} />
                    )}

                    {opphold.mottokPensjon?.valuta && (
                        <TekstGruppe tittel={t('felles.velgValuta')} innhold={opphold.mottokPensjon.valuta} />
                    )}
                </OppsummeringGruppe>
            ))}
        </OppsummeringSeksjon>
    )
})
