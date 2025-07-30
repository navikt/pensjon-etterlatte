import { BodyShort, Box, Label } from '@navikt/ds-react'
import { dtf } from '~utils/date'
import { JaNeiVetIkke } from '../../../api/dto/FellesOpplysninger'
import useTranslation from '../../../hooks/useTranslation'

const stringify = (content?: string | undefined) => {
    if (!content) return ''
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
    content?: string | undefined
}

export const TextGroup = ({ id, title, content }: TextGroupProps) => {
    return (
        <Box paddingBlock="0 2">
            <Label>{title}</Label>
            <BodyShort id={id}>{stringify(content)}</BodyShort>
        </Box>
    )
}

interface TextGroupGeneralQuestionProps extends Omit<TextGroupProps, 'content'> {
    content?: JaNeiVetIkke
}

export const TextGroupJaNeiVetIkke = ({ id, title, content }: TextGroupGeneralQuestionProps) => {
    const { t } = useTranslation('radiobuttons')

    return <TextGroup id={id} title={title} content={t(content || '')} />
}
