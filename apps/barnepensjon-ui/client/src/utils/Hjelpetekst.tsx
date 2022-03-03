import { HelptextFilled } from '@navikt/ds-icons'
import React, { PropsWithChildren, useRef, useState } from 'react'
import { Button, Popover } from '@navikt/ds-react'
import { v4 as uuid } from 'uuid'
import styled from 'styled-components'

const HjelpetekstDiv = styled.div`
    Button {
        min-width: 30px;
        padding: 0.1rem;
    }

    .navds-button svg {
        font-size: 1rem;
    }

    .navds-popover {
        padding: 1rem;
    }
`
const Hjelpetekst = ({ children }: PropsWithChildren<React.InputHTMLAttributes<HTMLInputElement>>) => {
    const [open, setOpen] = useState(false)

    const ref = useRef(null)
    const id = uuid()

    return (
        <HjelpetekstDiv>
            <Button
                ref={ref}
                data-testid="hjelpetekst-button"
                variant={'secondary'}
                className={'hvorforPanel__toggle'}
                onClick={() => setOpen(!open)}
                type={'button'}
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls={id}
            >
                <HelptextFilled />
            </Button>

            <Popover anchorEl={ref.current} open={open} placement={'top'} onClose={() => setOpen(false)}>
                {children}
            </Popover>
        </HjelpetekstDiv>
    )
}

export default Hjelpetekst
