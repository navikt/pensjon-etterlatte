import useTranslation from '../hooks/useTranslation'
import {LogEvents, useAmplitude} from "~hooks/useAmplitude";
import SanityTest from "~components/SanityTest";


export default function FrontPage() {
    const {t} = useTranslation('frontPage')
    const {logEvent} = useAmplitude()

    logEvent(LogEvents.PAGE_CHANGE)

    return (
        <div>
            <SanityTest />
        </div>
    )
}