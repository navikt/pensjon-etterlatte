import { Accordion } from '@navikt/ds-react'
import { useState } from 'react'
import { EditFilled } from '@navikt/ds-icons'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export const AccordionItem = ({ tittel, children, defaultOpen = false, path, pathText }: any) => {
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
                <Link to={path}>
                    <EditFilled />
                    <span style={{ paddingLeft: '0.25rem' }}>{t(`endreSvarOppsummering.${pathText}`)}</span>
                </Link>
            </Accordion.Content>
        </Accordion.Item>
    )
}
