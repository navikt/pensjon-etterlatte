import NavFrontendSpinner from "nav-frontend-spinner";
import { Normaltekst } from "nav-frontend-typografi";

const Spinner = ({ visible, label }: {
    visible: boolean;
    label: string;
}) => {
    if (!visible) return null;

    return (
        <div className={"spinner-overlay"}>
            <div className={"spinner-content"}>
                <NavFrontendSpinner />
                <Normaltekst>
                    {label}
                </Normaltekst>
            </div>
        </div>
    )
}

export default Spinner;
