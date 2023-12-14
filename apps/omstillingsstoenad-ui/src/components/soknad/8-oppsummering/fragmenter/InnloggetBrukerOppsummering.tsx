import { TekstGruppe } from './TekstGruppe'
import { useTranslation } from 'react-i18next'

export default function InnloggetBrukerOppsummering({
    navn,
    fornavn,
    etternavn,
    fnrDnr,
    statsborgerskap,
    sivilstatus,
    adresse,
}: {
    navn?: string
    fornavn?: string
    etternavn?: string
    fnrDnr?: string
    statsborgerskap?: string
    sivilstatus?: string
    adresse?: string
}) {
    const { t } = useTranslation('')

    return (
        <>
            {navn ? (
                <TekstGruppe tittel={t('felles.navn')} innhold={navn} />
            ) : (
                <>
                    <TekstGruppe tittel={t('felles.fornavn')} innhold={fornavn} />
                    <TekstGruppe tittel={t('felles.etternavn')} innhold={etternavn} />
                </>
            )}

            <TekstGruppe tittel={t('felles.fnrDnr')} innhold={fnrDnr} />
            <TekstGruppe tittel={t('felles.statsborgerskap')} innhold={statsborgerskap} />
            <TekstGruppe tittel={t('felles.sivilstatus')} innhold={sivilstatus} />
            {adresse && <TekstGruppe tittel={t('felles.adresse')} innhold={adresse} />}
        </>
    )
}
