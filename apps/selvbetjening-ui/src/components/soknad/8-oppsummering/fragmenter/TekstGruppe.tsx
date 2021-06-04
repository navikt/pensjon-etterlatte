import { Element, Normaltekst } from "nav-frontend-typografi";

const TekstGruppe = ({ tittel, innhold }: { tittel: string, innhold?: any }) => {
    return (
        <div className={"tekstgruppe"}>
            <Element>{tittel}</Element>
            <Normaltekst>{innhold}</Normaltekst>
        </div>
    )
}

export default TekstGruppe;
