import { SkjemaElement } from './felles/SkjemaElement'
import { BodyShort, Button, Heading, Link, Panel } from '@navikt/ds-react'
import { SkjemaGruppe } from './felles/SkjemaGruppe'

const SoeknadUgyldig = () => {
    return (
        <Panel>
            <SkjemaGruppe>
                <Heading size={'large'}>
                    Muligheten til å søke pengestøtte har utgått
                </Heading>
                <SkjemaElement>
                    <BodyShort>
                        Fra 1. april 2024 er det ikke lenger mulig å søke om gjenlevendepensjon eller
                        overgangsstønad. Du kan derimot søke om omstillingsstønad.
                    </BodyShort>
                </SkjemaElement>
                <SkjemaElement>
                    <Button as={'a'} href={'/omstillingsstonad/soknad'}>
                        Søk om omstillingsstønad
                    </Button>
                </SkjemaElement>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Heading size={'large'} level={"2"}>
                    It is no longer possible to apply for financial support
                </Heading>
                <SkjemaElement>
                    <BodyShort>
                        From April 1, 2024, it is no longer possible to apply for survivor’s pension or
                        transitional benefit. However, you can&nbsp;
                        <Link href={'/omstillingsstonad/soknad'}>apply for for adjustment allowance.</Link>
                    </BodyShort>
                </SkjemaElement>
            </SkjemaGruppe>
        </Panel>
    )
}

export default SoeknadUgyldig
