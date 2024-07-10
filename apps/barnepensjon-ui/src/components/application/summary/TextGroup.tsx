import { BodyShort, Label } from '@navikt/ds-react'
import useTranslation from '../../../hooks/useTranslation'
import { JaNeiVetIkke } from '../../../api/dto/FellesOpplysninger'
import styled from 'styled-components'
import { dtf } from '~utils/date'

const TextGroupDiv = styled.div`
    padding-bottom: 0.5rem;

    .typo-normal {
        margin: 0.2rem 0;
    }
`

const stringify = (content?: any) => {
    if (!content) return ''
    else if (typeof content !== 'string') return content.toString()
    else {
        const textWithDate = content.match(/\d{4}-\d{2}-\d{2}/)
        if (!!textWithDate?.length) {
            return content.replace(textWithDate[0], dtf.format(new Date(textWithDate[0])))
        } else {
            return content
        }
    }
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
