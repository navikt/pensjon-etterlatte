import { TekstGruppe } from './TekstGruppe'
import { useTranslation } from 'react-i18next'

export default function PersonInfoOppsummering({
    navn,
    fornavn,
    etternavn,
    fnrDnr,
    foedselsdato,
    statsborgerskap,
    sivilstatus,
    adresse,
}: {
    navn?: string
    fornavn?: string
    etternavn?: string
    fnrDnr?: string
    foedselsdato?: string
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

            {fnrDnr && <TekstGruppe tittel={t('felles.fnrDnr')} innhold={fnrDnr} />}
            {foedselsdato && <TekstGruppe tittel={t('felles.foedselsdato')} innhold={foedselsdato} />}

            <TekstGruppe tittel={t('felles.statsborgerskap')} innhold={statsborgerskap} />

            {sivilstatus && (
                <TekstGruppe tittel={t('felles.sivilstatus')} innhold={t(`pdl.sivilstatus.${sivilstatus}`)} />
            )}
            {adresse && <TekstGruppe tittel={t('felles.adresse')} innhold={adresse} />}
        </>
    )
}
