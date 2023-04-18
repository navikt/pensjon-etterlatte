import { BodyLong, Loader } from '@navikt/ds-react'
import styled from 'styled-components'

const SpinnerOverlay = styled.div`
    position: fixed;
    display: block;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 0.75);
    z-index: 999;
    pointer-events: none;
    overflow: no-display;
`

const SpinnerContent = styled.div`
    padding: 3rem;
    background-color: white;
    border-radius: 5px;
    box-shadow: 5px 5px 15px 0 #ddd;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
`

const LoaderOverlay = ({ visible, label }: { visible: boolean; label: string }) => {
    if (!visible) return null

    return (
        <SpinnerOverlay>
            <SpinnerContent>
                <Loader />
                <BodyLong spacing>{label}</BodyLong>
            </SpinnerContent>
        </SpinnerOverlay>
    )
}

export default LoaderOverlay
