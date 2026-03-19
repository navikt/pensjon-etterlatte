import { PencilIcon } from '@navikt/aksel-icons'
import { Accordion, HStack } from '@navikt/ds-react'
import { JSX, useState } from 'react'
import { Link } from 'react-router-dom'

interface Props {
    title: string
    path: string
    children: JSX.Element | JSX.Element[] | undefined
    pathText: string
    defaultOpen?: boolean
}

export const AccordionItem = ({ title, children, defaultOpen = false, path, pathText }: Props) => {
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
                {title}
            </Accordion.Header>
            <Accordion.Content>
                {children}
                <Link to={path}>
                    <HStack gap="space-4">
                        <PencilIcon font-size="1.5rem" aria-hidden />
                        <span>{pathText}</span>
                    </HStack>
                </Link>
            </Accordion.Content>
        </Accordion.Item>
    )
}
