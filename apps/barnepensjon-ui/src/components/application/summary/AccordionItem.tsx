import { EditFilled } from '@navikt/ds-icons'
import { Accordion } from '@navikt/ds-react'
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
                    <EditFilled aria-hidden />
                    <span style={{ paddingLeft: '0.25rem' }}>{pathText}</span>
                </Link>
            </Accordion.Content>
        </Accordion.Item>
    )
}
