import { User } from '../context/user/user'
import { IParent } from '../context/application/application'
import { dtf } from '~utils/date'

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
    const dateOfBirth = !!parent.fnrDnr ? parent.fnrDnr.substring(0, 6) : dtf.format(new Date(parent.dateOfBirth!))

    return `${parent.firstName} ${parent.lastName} (f. ${dateOfBirth})`
}
