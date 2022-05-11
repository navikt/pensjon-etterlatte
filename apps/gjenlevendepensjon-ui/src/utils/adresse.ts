import { IBruker } from "../context/bruker/bruker";

export const fullAdresse = (bruker: IBruker): String => {
    if (bruker.adressebeskyttelse || !bruker.adresse) return ""

    return bruker.adresse
        + (bruker.husnummer ? ` ${bruker.husnummer}` : "")
        + (bruker.husbokstav ? bruker.husbokstav : "")
        + `, ${bruker.postnummer} ${bruker.poststed}`
}
