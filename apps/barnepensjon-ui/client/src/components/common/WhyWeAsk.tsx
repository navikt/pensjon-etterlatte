import { Collapse, Expand } from '@navikt/ds-icons'
import { BodyLong } from '@navikt/ds-react'
import { FC, useState } from 'react'
import styled from 'styled-components'
import useTranslation from '../../hooks/useTranslation'

const ToggleButton = styled.button`
    color: #0067c5;
    text-decoration: underline;
    background: none;
    border: none;
    padding: 0.2rem 0;
    min-height: 0;
    margin: 0;
    cursor: pointer;
    border-radius: 0.25rem;
`

const Innhold = styled.div`
    margin-top: 1rem;
`

const WhyWeAsk: FC<{ title: string; children: any }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false)
    const { t } = useTranslation('common')

    const click = () => {
        // TODO: Sjekke om dette er noe vi skal logge i Amplitude, tilsvarende gjenlevendepensjon søknad
        setIsOpen(!isOpen)
    }

    return (
        <>
            <ToggleButton data-testid="toggle" type={'button'} onClick={click} aria-expanded={isOpen}>
                <span>{t('whyWeAsk')}</span>
                <span>{isOpen ? <Collapse /> : <Expand />}</span>
            </ToggleButton>

            {isOpen && (
                <Innhold>
                    <BodyLong>{children}</BodyLong>
                </Innhold>
            )}
        </>
    )
}

export default WhyWeAsk
