import { PencilIcon } from '@navikt/aksel-icons'
import { Accordion, HStack, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

// biome-ignore lint/suspicious/noExplicitAny: gammel kode, venter med å fikse
export const AccordionItem = ({ tittel, children, defaultOpen = false, path, pathText, senderSoeknad }: any) => {
    const { t } = useTranslation()
    const [open, setOpen] = useState(defaultOpen)

    return (
        <Accordion.Item open={open}>
            <Accordion.Header
                onClick={(e) => {
                    e.preventDefault()
                    setOpen(!open)
                }}
                aria-expanded={open}
            >
                {tittel}
            </Accordion.Header>
            <Accordion.Content>
                {children}
                <Link to={path} className={senderSoeknad ? 'disabled' : ''}>
                    <HStack gap="space-4">
                        <PencilIcon aria-hidden fontSize="1.5rem" />
                        <span>{t(`endreSvarOppsummering.${pathText}`)}</span>
                    </HStack>
                </Link>
            </Accordion.Content>
        </Accordion.Item>
    )
}
