import { FC, useState } from 'react'
import { Collapse, Expand } from '@navikt/ds-icons'
import { BodyLong } from '@navikt/ds-react'
import useTranslation from '../../hooks/useTranslation'
import styled from 'styled-components'

const WhyWeAsk: FC<{ title: string; children: any }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false)
    const { t } = useTranslation('felles')

    const click = () => {
        // TODO: Sjekke om dette er noe vi skal logge i Amplitude, tilsvarende gjenlevendepensjon søknad
        setIsOpen(!isOpen)
    }

    const HvorforPanel = styled.div`
        & .toggle {
            color: #0067c5;
            text-decoration: underline;
            background: none;
            border: none;
            padding: 0.2rem 0;
            min-height: 0;
            margin: 0;
            cursor: pointer;
            border-radius: 0.25rem;
        }

        & .innhold {
            margin-top: 1rem;
        }
    `
    return (
        <HvorforPanel>
            <button data-testid="toggle" type={'button'} className={'toggle'} onClick={click} aria-expanded={isOpen}>
                <span>{t('hvorforSpoerVi')}</span>
                <span>{isOpen ? <Collapse /> : <Expand />}</span>
            </button>

            {isOpen && (
                <div className={'innhold'}>
                    <BodyLong>{children}</BodyLong>
                </div>
            )}
        </HvorforPanel>
    )
}

export default WhyWeAsk
