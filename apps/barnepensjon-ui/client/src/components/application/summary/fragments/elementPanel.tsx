import { Heading, Panel } from '@navikt/ds-react'
import { v4 as uuid } from 'uuid'
import TextGroup from '../TextGroup'

export const elementPanel = ({
    title,
    content,
}: {
    title?: String
    content: { question: string; answer: string | Date | number }[]
}) => (
    <Panel key={uuid()}>
        {title && <Heading size={'small'}>{title}</Heading>}

        {content.map(({ question, answer }) => (
            <TextGroup key={uuid()} title={question} content={answer} />
        ))}
    </Panel>
)
