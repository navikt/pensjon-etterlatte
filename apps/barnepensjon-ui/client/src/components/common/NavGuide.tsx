import veileder from '../../assets/veileder.svg'
import { SpeechBubble } from '@navikt/ds-react'
import { ReactNode } from 'react'

export default function NavGuide({ children }: { children: ReactNode }) {
    return (
        <SpeechBubble illustration={<img alt="veileder" src={veileder} />} position="left">
            <SpeechBubble.Bubble>{children}</SpeechBubble.Bubble>
        </SpeechBubble>
    )
}
