export type Namespace =
    | 'app'
    | 'frontPage'
    | 'aboutYou'
    | 'error'
    | 'common'
    | 'navigation'
    | 'radiobuttons'
    | 'btn'
    | 'pageNotFound'
    | 'systemUnavailable'
    | 'inntektsjustering'

export type TNamespace = Readonly<NonNullable<Namespace>>
export type Translation = Readonly<NonNullable<string>>
export type TKey = Readonly<NonNullable<string>>
export type TMeta = {
    ns?: TNamespace
    [key: string]: TKey | undefined
}
