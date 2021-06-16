import { Element, Normaltekst } from "nav-frontend-typografi";

const stringify = (innhold?: any) => {
    if (!innhold) return "";
    else if (typeof innhold !== "string") return innhold.toString()
    else return innhold
}

const TekstGruppe = ({ tittel, innhold }: { tittel: string, innhold?: any }) => {
    return (
        <div className={"tekstgruppe"}>
            <Element>{tittel}</Element>
            <Normaltekst>{stringify(innhold)}</Normaltekst>
        </div>
    )
};

export default TekstGruppe;
