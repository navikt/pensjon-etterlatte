import { BodyLong, Button, Modal } from '@navikt/ds-react'

interface ModalProps {
    prev?: () => void
    open: boolean
    setOpen: (open: boolean) => void
}

export const PrevStepModal = ({ prev, open, setOpen }: ModalProps) => {
    // TODO: Legg til oversettelser
    // TODO: Lag tester for å se om ting lagres riktig
    return (
        <Modal
            header={{
                heading: 'Gå tilbake uten å lagre',
                closeButton: true,
            }}
            onClose={() => setOpen(false)}
            open={open}
        >
            <Modal.Body>
                <BodyLong>Ønsker du å gå tilbake til forrige steg uten å lagre endringer?</BodyLong>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    type="button"
                    onClick={() => {
                        setOpen(false)
                    }}
                >
                    Fortsett å fyll ut skjema
                </Button>
                <Button
                    type="button"
                    variant="tertiary"
                    onClick={() => {
                        setOpen(false)
                        prev!()
                    }}
                >
                    Gå tilbake uten å lagre
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
