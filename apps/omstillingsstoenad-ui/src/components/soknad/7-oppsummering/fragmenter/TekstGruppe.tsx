import { BodyShort, Label } from '@navikt/ds-react'

const stringify = (innhold?: any) => {
    if (!innhold) return ''
    else if (typeof innhold !== 'string') return innhold.toString()
    else return innhold
}

const TekstGruppe = ({ tittel, innhold, id }: { tittel: string; innhold?: any; id?: string }) => {
    return (
        <div className={'tekstgruppe'}>
            <Label>{tittel}</Label>
            <BodyShort id={id}>{stringify(innhold)}</BodyShort>
        </div>
    )
}

export default TekstGruppe
