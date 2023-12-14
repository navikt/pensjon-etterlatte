import { Accordion } from '@navikt/ds-react'
import { useState } from 'react'
import { EditFilled } from '@navikt/ds-icons'
import { Link } from 'react-router-dom'

export const AccordionItem = ({ tittel, children, defaultOpen = false, path, pathText }: any) => {
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
                <Link to={path}>
                    <EditFilled />
                    <span style={{ paddingLeft: '0.25rem' }}>{pathText}</span>
                </Link>
            </Accordion.Content>
        </Accordion.Item>
    )
}
