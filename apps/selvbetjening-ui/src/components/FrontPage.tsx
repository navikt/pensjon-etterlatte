import {LogEvents, useAmplitude} from "~hooks/useAmplitude";


export default function FrontPage() {
    const { logEvent } = useAmplitude()

    logEvent(LogEvents.PAGE_CHANGE)

    return (
        <div>Selvbetjening</div>
    )
}
