import { Heading, Panel } from '@navikt/ds-react'
import { v4 as uuid } from 'uuid'
import { Element } from '../../../../utils/ObjectTreeReader'
import TextGroup from '../TextGroup'

export const elementPanel = ({ title, content }: Element) => (
    <Panel key={uuid()}>
        {title && <Heading size={'small'}>{title}</Heading>}

        {content.map(({ spoersmaal, svar }) => (
            <TextGroup key={uuid()} title={spoersmaal} content={svar} />
        ))}
    </Panel>
)
