import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { IBruker } from '../../../../context/bruker/bruker'
import { ISoeker } from '../../../../typer/person'
import { StegLabelKey, StegPath } from '../../../../typer/steg'
import { fullAdresse } from '../../../../utils/adresse'
import { OppsummeringGruppe } from '../OppsummeringGruppe'
import { OppsummeringSeksjon } from '../OppsummeringSeksjon'
import PersonInfoOppsummering from './PersonInfoOppsummering'
import { TekstGruppe } from './TekstGruppe'
import UtbetalingsInformasjonOppsummering from './UtbetalingsInformasjonOppsummering'

interface Props {
    omDeg: ISoeker
    bruker: IBruker
    senderSoeknad: boolean
}

export const OppsummeringOmDeg = memo(({ omDeg, bruker, senderSoeknad }: Props) => {
    const { t } = useTranslation()

    return (
        <OppsummeringSeksjon
            tittel={t(StegLabelKey.OmDeg)}
            path={`/skjema/steg/${StegPath.OmDeg}`}
            pathText={StegPath.OmDeg}
            senderSoeknad={senderSoeknad}
        >
            <OppsummeringGruppe tittel={t('omDeg.undertittel.personalia')}>
                <PersonInfoOppsummering
                    navn={`${bruker.fornavn} ${bruker.etternavn}`}
                    fnrDnr={bruker.foedselsnummer}
                    statsborgerskap={bruker.statsborgerskap}
                    sivilstatus={bruker.sivilstatus}
                    adresse={fullAdresse(bruker)}
                />
                {(bruker.telefonnummer || omDeg.kontaktinfo?.telefonnummer) && (
                    <TekstGruppe
                        tittel={t('felles.telefonnummer')}
                        innhold={bruker.telefonnummer || omDeg.kontaktinfo?.telefonnummer}
                    />
                )}
                {omDeg.alternativAdresse && (
                    <TekstGruppe tittel={t('omDeg.alternativAdresse')} innhold={omDeg.alternativAdresse} />
                )}
            </OppsummeringGruppe>

            {omDeg.utbetalingsInformasjon && (
                <UtbetalingsInformasjonOppsummering utbetalingsInformasjon={omDeg.utbetalingsInformasjon} />
            )}
        </OppsummeringSeksjon>
    )
})
