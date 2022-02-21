import { FC, useState } from 'react'
//import { v4 as uuid } from "uuid";
import { Collapse, Expand } from '@navikt/ds-icons'
import { BodyLong } from '@navikt/ds-react'
import useTranslation from '../../hooks/useTranslation'
// import { LogEvents, useAmplitude } from "../../utils/amplitude";

const WhyWeAsk: FC<{ title: string; children: any }> = ({ title, children }) => {
    //const id = uuid();
    const [isOpen, setIsOpen] = useState(false)
    const { t } = useTranslation()
    // const { logEvent } = useAmplitude();

    const click = () => {
        /* if (!isOpen) {
            logEvent(LogEvents.KLIKK, { type: "hvorfor spør vi", title });
        } */
        setIsOpen(!isOpen)
    }

    return (
        <div className={'hvorforPanel'} /*id={id}*/>
            <button
                data-testid="hvorforPanel_toggle"
                type={'button'}
                className={'hvorforPanel__toggle'}
                onClick={click}
                aria-expanded={isOpen}
            >
                <span>{t('felles:hvorforSpoerVi')}</span>
                <span>{isOpen ? <Collapse /> : <Expand />}</span>
            </button>

            {isOpen && (
                <div className={'hvorforPanel__innhold'}>
                    <BodyLong>{children}</BodyLong>
                </div>
            )}
        </div>
    )
}

export default WhyWeAsk
