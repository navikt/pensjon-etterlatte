import { BodyShort, Label } from '@navikt/ds-react'
import useTranslation from '../../../hooks/useTranslation'
import { JaNeiVetIkke } from '../../../api/dto/FellesOpplysninger'

const stringify = (content?: any) => {
    if (!content) return ''
    else if (typeof content !== 'string') return content.toString()
    else return content
}

interface TextGroupProps {
    id?: string
    title: string
    content?: any
}

export const TextGroup = ({ id, title, content }: TextGroupProps) => {
    return (
        <div className={'tekstgruppe'}>
            <Label>{title}</Label>
            <BodyShort id={id}>{stringify(content)}</BodyShort>
        </div>
    )
}

interface TextGroupGeneralQuestionProps extends Omit<TextGroupProps, 'content'> {
    content?: JaNeiVetIkke
}

export const TextGroupJaNeiVetIkke = ({ id, title, content }: TextGroupGeneralQuestionProps) => {
    const { t } = useTranslation('radiobuttons')

    return <TextGroup id={id} title={title} content={t(content || '')} />
}
