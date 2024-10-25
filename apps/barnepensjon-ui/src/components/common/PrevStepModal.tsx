import { BodyLong, Button, Modal } from '@navikt/ds-react'
import useTranslation from '~hooks/useTranslation'

interface ModalProps {
    prev?: () => void
    open: boolean
    setOpen: (open: boolean) => void
}

export const PrevStepModal = ({ prev, open, setOpen }: ModalProps) => {
    const { t } = useTranslation('navigation')

    return (
        <Modal
            header={{
                heading: t('goBackWithoutSaving'),
                closeButton: true,
            }}
            onClose={() => setOpen(false)}
            open={open}
        >
            <Modal.Body>
                <BodyLong>{t('goBackWithoutSavingBody')}</BodyLong>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    type="button"
                    onClick={() => {
                        setOpen(false)
                    }}
                >
                    {t('continueApplicationButton')}
                </Button>
                <Button
                    type="button"
                    variant="tertiary"
                    onClick={() => {
                        setOpen(false)
                        prev!()
                    }}
                >
                    {t('goBackWithoutSaving')}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
