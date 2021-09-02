import { FC, useState } from "react";
import { v4 as uuid } from "uuid";
import { Collapse, Expand } from "@navikt/ds-icons"
import { BodyLong } from "@navikt/ds-react"

const HvorforSpoerVi: FC = ({ children }) => {
    const id = uuid();
    const [erApen, setErApen] = useState(false);

    return (
        <div className={"hvorforPanel"} id={id}>
            <button
                type={"button"}
                className={"hvorforPanel__toggle"}
                onClick={() => setErApen(!erApen)}
            >
                <span>
                    Hvorfor spør vi om dette?
                </span>
                <span>
                    {erApen ? <Collapse/> : <Expand/>}
                </span>
            </button>

            {erApen && (
                <div className={"hvorforPanel__innhold"}>
                    <BodyLong>
                        {children}
                    </BodyLong>
                </div>
            )}
        </div>
    )
}

export default HvorforSpoerVi;
