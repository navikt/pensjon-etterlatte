export const steg = [
    { path: 'personopplysninger', label: 'skjema.personopplysninger' },
    { path: 'situasjonen-din', label: 'skjema.situasjonenDin' },
    { path: 'utdanning-og-tiltak', label: 'skjema.utdanningOgTiltak' },
    { path: 'inntekt', label: 'skjema.inntekt' },
    { path: 'dokumentasjon', label: 'skjema.dokumentasjon' },
    { path: 'oppsummering', label: 'skjema.oppsummering' },
] as const

export type StegPath = (typeof steg)[number]['path']

export const erStegPath = (path: unknown): path is StegPath => steg.some((side) => side.path === path)

export const stegUrl = (path: StegPath) => `/skjema/steg/${path}`
