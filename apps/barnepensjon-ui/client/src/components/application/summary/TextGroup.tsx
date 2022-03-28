import { BodyShort, Label } from '@navikt/ds-react'
import useTranslation from '../../../hooks/useTranslation'
import { JaNeiVetIkke } from '../../../api/dto/FellesOpplysninger'
import styled from 'styled-components'

const TextGroupDiv = styled.div`
    padding-bottom: 0.5rem;

    .typo-normal {
        margin: 0.2rem 0;
    }
`

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
        <TextGroupDiv>
            <Label>{title}</Label>
            <BodyShort id={id}>{stringify(content)}</BodyShort>
        </TextGroupDiv>
    )
}

interface TextGroupGeneralQuestionProps extends Omit<TextGroupProps, 'content'> {
    content?: JaNeiVetIkke
}

export const TextGroupJaNeiVetIkke = ({ id, title, content }: TextGroupGeneralQuestionProps) => {
    const { t } = useTranslation('radiobuttons')

    return <TextGroup id={id} title={title} content={t(content || '')} />
}
