import { FC, useState } from "react";
import { v4 as uuid } from "uuid";
import { Normaltekst } from "nav-frontend-typografi";
import { NedChevron, OppChevron } from "nav-frontend-chevron";

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
                    {erApen ? <OppChevron/> : <NedChevron/>}
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
