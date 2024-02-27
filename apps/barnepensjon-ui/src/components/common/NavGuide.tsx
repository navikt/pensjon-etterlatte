import navguide from '../../assets/navguide.svg'
import { ReactNode } from 'react'
import styled from 'styled-components'

const NavGuideWrapper = styled.div`
    align-items: start;
    display: flex;
    justify-content: start;
    position: relative;
    flex-direction: row-reverse;
`

const NavGuideIcon = styled.div`
    align-items: flex-start;
    display: flex;
    flex-shrink: 0;
    justify-content: center;
    order: 3;
    overflow: hidden;
    height: 5rem;
    width: 5rem;
`

const Icon = styled.img`
    height: 90%;
    width: 100%;
`

const SpeechBubble = styled.div`
    background: #e6f0ff;
    border-radius: 0 1rem 1rem 1rem;
    order: 1;
    padding: 1.25rem;
    text-align: left;
`

export default function NavGuide({ children }: { children?: ReactNode }) {
    return (
        <NavGuideWrapper>
            <NavGuideIcon>
                <Icon alt="navguide" src={navguide} />
            </NavGuideIcon>

            {children && <SpeechBubble>{children}</SpeechBubble>}
        </NavGuideWrapper>
    )
}
