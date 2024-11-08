import { Alert, Heading } from '@navikt/ds-react'

export const HarIkkeOMSSakAlert = () => {
    return (
        <Alert variant="info">
            <Heading size="small" level="3" spacing>
                Dette skjemaet er ikke aktuelt for deg
            </Heading>
            <div>
                Vi kan ikke se at du mottar omstillingsstønad, og du trenger derfor ikke å melde inntektsendring til
                oss. Hvis dette ikke stemmer, vennligts LENKE_KOMMER_HER
            </div>
        </Alert>
    )
}
