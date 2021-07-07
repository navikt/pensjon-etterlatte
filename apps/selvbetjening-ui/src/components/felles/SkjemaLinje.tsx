import { FC } from "react";
import { SkjemaGruppe } from "nav-frontend-skjema";


const SkjemaLinje: FC = ({ children }) => {
    return (
        <SkjemaGruppe className={"skjemalinje"}>
            {children}
        </SkjemaGruppe>
    )
}

export default SkjemaLinje;
