import { FC, useState } from "react";
import { v4 as uuid } from "uuid";
import { Normaltekst } from "nav-frontend-typografi";
import { Collapse, Expand } from "@navikt/ds-icons"

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
                    <Normaltekst>
                        {children}
                    </Normaltekst>
                </div>
            )}
        </div>
    )
}

export default HvorforSpoerVi;
