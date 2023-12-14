import { BodyShort, Label } from '@navikt/ds-react'
import { JaNeiVetIkke } from '../../../../api/dto/FellesOpplysninger'
import { useTranslation } from 'react-i18next'

const dtf = Intl.DateTimeFormat('no-NO', {
    timeZone: 'Europe/Oslo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
})

/*
* const stringify = (innhold?: any) => {
    if (!innhold) return ''
    else if (typeof innhold !== 'string') return innhold.toString()
    else return innhold
}
* */

const stringify = (content?: any) => {
    if (!content) return ''
    else if (typeof content !== 'string') return content.toString()
    else {
        if (!!content.match(/\d{4}-\d{2}-\d{2}.*/)?.length) {
            return dtf.format(new Date(content))
        } else {
            return content
        }
    }
}

interface TekstGruppeProps {
    tittel: string
    innhold?: any
    id?: string
}

export const TekstGruppe = ({ tittel, innhold, id }: TekstGruppeProps) => {
    return (
        <div className={'tekstgruppe'}>
            <Label>{tittel}</Label>
            <BodyShort id={id}>{stringify(innhold)}</BodyShort>
        </div>
    )
}

interface TekstGruppeStandardSpoersmaalProps extends Omit<TekstGruppeProps, 'innhold'> {
    innhold?: JaNeiVetIkke
}

export const TekstGruppeJaNeiVetIkke = ({ id, tittel, innhold }: TekstGruppeStandardSpoersmaalProps) => {
    const { t } = useTranslation('')

    return <TekstGruppe id={id} tittel={tittel} innhold={t(innhold || '')} />
}
