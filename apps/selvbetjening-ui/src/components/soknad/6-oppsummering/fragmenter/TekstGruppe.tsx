import { Element, Normaltekst } from "nav-frontend-typografi";

const stringify = (innhold?: any) => {
    if (!innhold) return "";
    else if (typeof innhold !== "string") return innhold.toString()
    else return innhold
}

const TekstGruppe = ({ tittel, innhold, id }: { tittel: string, innhold?: any, id?: string }) => {
    return (
        <div className={"tekstgruppe"}>
            <Element>{tittel}</Element>
            <Normaltekst id={id}>{stringify(innhold)}</Normaltekst>
        </div>
    )
};

export default TekstGruppe;
