import { GlobalAlert } from '@navikt/ds-react'
import { FeatureToggleNavn, FeatureToggleStatus, useFeatureToggle } from './featureToggles/FeatureTogglesContext.tsx'
import { useSpraak } from './spraak/SpraakContext.tsx'
import { Spraak } from './spraak/spraak.ts'

const tekster = {
    [Spraak.BOKMAAL]: {
        tittel: 'Søknaden kan ikke sendes inn',
        innhold:
            'Dette skyldes planlagt vedlikehold 5. november fra kl. 15.30 til kl. 21.00. Vi lagrer søknaden din i 48 timer. Prøv igjen etter kl. 21.00.',
    },
    [Spraak.NYNORSK]: {
        tittel: 'Søknaden kan ikkje sendast inn',
        innhold:
            'Dette kjem av planlagt vedlikehald 5. november frå kl. 15.30 til kl. 21.00. Vi lagrar søknaden din i 48 timar. Prøv igjen etter kl. 21.00.',
    },
    [Spraak.ENGELSK]: {
        tittel: 'You cannot submit your application',
        innhold:
            'This is due to planned maintenance on 5 November from 15:30 to 21:00. We save your application for 48 hours. Try again after 21:00.',
    },
}

export const Vedlikeholdsvarsel = () => {
    const featureToggle = useFeatureToggle(FeatureToggleNavn.VEDLIKEHOLDSVARSEL)
    const spraak = useSpraak()

    if (featureToggle.status !== FeatureToggleStatus.PAA) {
        return null
    }

    const tekst = tekster[spraak]

    return (
        <GlobalAlert status="announcement">
            <GlobalAlert.Header>
                <GlobalAlert.Title>{tekst.tittel}</GlobalAlert.Title>
            </GlobalAlert.Header>
            <GlobalAlert.Content>{tekst.innhold}</GlobalAlert.Content>
        </GlobalAlert>
    )
}
