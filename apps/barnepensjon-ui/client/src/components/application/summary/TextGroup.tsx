import { BodyShort, Label } from '@navikt/ds-react'

const stringify = (content?: any) => {
    if (!content) return ''
    else if (typeof content !== 'string') return content.toString()
    else return content
}

const TextGroup = ({ title, content, id }: { title: string; content?: any; id?: string }) => {
    return (
        <div className={'tekstgruppe'}>
            <Label>{title}</Label>
            <BodyShort id={id}>{stringify(content)}</BodyShort>
        </div>
    )
}

export default TextGroup
