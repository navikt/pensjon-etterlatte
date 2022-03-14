import { EditFilled } from '@navikt/ds-icons'
import { Accordion } from '@navikt/ds-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export const AccordionItem = ({ title, children, defaultOpen = false, path, pathText }: any) => {
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
                    <EditFilled className={'edit-svg'} />
                    <span>{pathText}</span>
                </Link>
            </Accordion.Content>
        </Accordion.Item>
    )
}
