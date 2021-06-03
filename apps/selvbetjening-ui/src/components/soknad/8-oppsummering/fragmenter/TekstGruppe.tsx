import { Element, Normaltekst } from "nav-frontend-typografi";
import { SkjemaGruppe } from "nav-frontend-skjema";

const TekstGruppe = ({ tittel, innhold }: { tittel: string, innhold?: any }) => {
    return (
        <SkjemaGruppe>
            <Element>{tittel}</Element>
            <Normaltekst>{innhold}</Normaltekst>
        </SkjemaGruppe>
    )
}

export default TekstGruppe;
