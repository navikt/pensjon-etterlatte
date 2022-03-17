import { User } from '../context/user/user'

export const fullAdresse = (person: User): string => {
    if (person.adressebeskyttelse || !person.adresse) return ''

    return (
        person.adresse +
        (person.husnummer ? ` ${person.husnummer}` : '') +
        (person.husbokstav ? person.husbokstav : '') +
        `, ${person.postnummer} ${person.poststed}`
    )
}
