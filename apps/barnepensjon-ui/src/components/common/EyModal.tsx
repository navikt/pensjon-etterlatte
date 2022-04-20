import { PropsWithChildren } from 'react'
import styled from 'styled-components'
import { Modal } from '@navikt/ds-react'

const CustomModal = styled(Modal)`
    max-width: 650px;
    width: 100%;
    position: fixed !important;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    text-align: center;
    padding: 3rem;

    @media screen and (max-width: 650px) {
        .knapp {
            font-size: 0.8em;
            padding: 0 1em;
        }
    }

    .skjemagruppe {
        margin-bottom: 1rem !important;

        .skjemaelement {
            margin-bottom: 0 !important;
        }
    }

    .skjemaelement {
        margin-bottom: 1rem !important;
    }

    .skjemagruppe {
        margin-bottom: 2rem !important;
    }

    .navds-modal__button {
        visibility: hidden;
    }
`

interface Props {
    open: boolean
    onClose: () => void
}

export default function EyModal({ children, open, onClose }: PropsWithChildren<Props>) {
    return (
        <CustomModal open={open} onClose={onClose}>
            {children}
        </CustomModal>
    )
}
