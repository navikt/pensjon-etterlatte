export type Namespace =
    | 'frontPage'
    | 'selectScenario'
    | 'aboutYou'
    | 'aboutParents'
    | 'livingParent'
    | 'aboutTheDeceased'
    | 'aboutChildren'
    | 'summary'
    | 'receipt'
    | 'logOutUser'
    | 'error'
    | 'common'
    | 'loggedInUserInfo'
    | 'navigation'
    | 'paymentDetails'
    | 'radiobuttons'
    | 'pageNotFound'
    | 'systemUnavailable'
    | 'yourSituation'

export type TNamespace = Readonly<NonNullable<Namespace>>
export type Translation = Readonly<NonNullable<string>>
export type TKey = Readonly<NonNullable<string>>
export type TMeta = {
    ns?: TNamespace
    [key: string]: TKey | undefined
}
