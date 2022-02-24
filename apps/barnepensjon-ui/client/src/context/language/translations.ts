export type Namespace = string
export type Translation = string
export type TKey = string
export type TMeta = {
    ns?: Namespace | Readonly<Namespace>
    [key: string]: string | undefined
}
