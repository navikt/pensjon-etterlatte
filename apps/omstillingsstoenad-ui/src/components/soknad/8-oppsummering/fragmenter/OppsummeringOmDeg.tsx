import { Heading, Panel } from '@navikt/ds-react'
import { memo } from 'react'
import { AccordionItem } from '../AccordionItem'
import { IBruker } from '../../../../context/bruker/bruker'
import { ISoeker } from '../../../../typer/person'
import { useTranslation } from 'react-i18next'
import { StegPath, StegLabelKey } from '../../../../typer/steg'
import { TekstGruppe } from './TekstGruppe'
import PersonInfoOppsummering from './PersonInfoOppsummering'
import { fullAdresse } from '../../../../utils/adresse'
import UtbetalingsInformasjonOppsummering from './UtbetalingsInformasjonOppsummering'

interface Props {
    omDeg: ISoeker
    bruker: IBruker
}

export const OppsummeringOmDeg = memo(({ omDeg, bruker }: Props) => {
    const { t } = useTranslation()

    return (
        <AccordionItem
            tittel={t(StegLabelKey.OmDeg)}
            path={`/skjema/steg/${StegPath.OmDeg}`}
            pathText={t(StegLabelKey.OmDeg)}
        >
            <Panel>
                <Heading size={'small'}>{t('omDeg.undertittel.personalia')}</Heading>

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
            </Panel>

            <Panel>
                {omDeg.utbetalingsInformasjon && (
                    <UtbetalingsInformasjonOppsummering utbetalingsInformasjon={omDeg.utbetalingsInformasjon} />
                )}
            </Panel>
        </AccordionItem>
    )
})
