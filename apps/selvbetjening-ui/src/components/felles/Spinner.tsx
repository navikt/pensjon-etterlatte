import { Normaltekst } from "nav-frontend-typografi";
import { Loader } from "@navikt/ds-react";

const Spinner = ({ visible, label }: {
    visible: boolean;
    label: string;
}) => {
    if (!visible) return null;

    return (
        <div className={"spinner-overlay"}>
            <div className={"spinner-content"}>
                <Loader />
                <Normaltekst>
                    {label}
                </Normaltekst>
            </div>
        </div>
    )
}

export default Spinner;
