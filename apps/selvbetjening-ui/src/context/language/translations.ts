export type Namespace =
    | 'app'
    | 'frontPage'
    | 'aboutYou'
    | 'aboutParents'
    | 'livingParent'
    | 'aboutTheDeceased'
    | 'aboutChildren'
    | 'summary'
    | 'receipt'
    | 'error'
    | 'common'
    | 'loggedInUserInfo'
    | 'navigation'
    | 'paymentDetails'
    | 'radiobuttons'
    | 'btn'
    | 'steps'
    | 'pageNotFound'
    | 'systemUnavailable'
    | 'yourSituation'
    | 'continueApplicationModal'
    | 'invalidApplicant'

export type TNamespace = Readonly<NonNullable<Namespace>>
export type Translation = Readonly<NonNullable<string>>
export type TKey = Readonly<NonNullable<string>>
export type TMeta = {
    ns?: TNamespace
    [key: string]: TKey | undefined
}
