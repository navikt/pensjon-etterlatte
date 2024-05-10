import { User } from '../context/user/user'
import { IParent } from '../context/application/application'

export const fullAdresse = (person: User): string => {
    if (person.adressebeskyttelse || !person.adresse) return ''

    return (
        person.adresse +
        (person.husnummer ? ` ${person.husnummer}` : '') +
        (person.husbokstav ? person.husbokstav : '') +
        `, ${person.postnummer} ${person.poststed}`
    )
}

export const nameAndFnr = (parent: IParent) => {
    return `${parent.firstName} ${parent.lastName} (f. ${parent.fnrDnr.substring(0, 6)})`
}
