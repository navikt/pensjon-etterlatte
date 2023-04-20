import veileder from '../../assets/ikoner/veileder.svg'
import { ReactNode } from 'react'
import styled from 'styled-components'

/**
 * Skamløst stjålet fra gamle nav-frontend.
 * Gjort siden dagens "SpeechBubble" i ds-react er noe mangelfull sammenlignet med den gamle.
 * Burde konvertere til ds-react sin variant når den blir brukbar.
 */

const NavGuideWrapper = styled.div`
    align-items: center;
    display: flex;
    justify-content: center;
    position: relative;
    flex-direction: row-reverse;
`

const NavGuideIcon = styled.div`
    align-items: flex-end;
    background: #c9c9c9;
    border-radius: 50%;
    display: flex;
    flex-shrink: 0;
    justify-content: center;
    order: 3;
    overflow: hidden;
    height: 6.25rem;
    width: 6.25rem;
`

const Icon = styled.img`
    height: 90%;
    width: 100%;
`

const SpeechBubble = styled.div`
    background: #efefef;
    border-radius: 0.5rem;
    order: 1;
    padding: 1.25rem;
    text-align: left;
`

const SpeechBubbleArrow = styled.div`
    border-bottom: 1.25rem solid transparent;
    border-right: 1.25rem solid #efefef;
    display: block;
    height: 1.25rem;
    order: 2;
    margin-left: 0.75rem;
    border-top: 1.25rem solid transparent;
`

export function Veileder({ children }: { children?: ReactNode }) {
    return (
        <NavGuideWrapper>
            <NavGuideIcon>
                <Icon alt="veileder" src={veileder} />
            </NavGuideIcon>

            {children && (
                <>
                    <SpeechBubbleArrow />

                    <SpeechBubble>{children}</SpeechBubble>
                </>
            )}
        </NavGuideWrapper>
    )
}
