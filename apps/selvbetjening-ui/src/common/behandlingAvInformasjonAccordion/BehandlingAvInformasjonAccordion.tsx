import { Accordion, BodyShort, Link } from '@navikt/ds-react'
import { KomponentLaster } from '../KomponentLaster.tsx'
import { SanityRikTekst } from '../sanity/SanityRikTekst.tsx'
import { useSanityInnhold } from '../sanity/useSanityInnhold.ts'
import { BehandlingAvInformasjonAccordion as BehandlingAvInformasjonAccordionInnhold } from '../sanity.types.ts'
import { useSpraak } from '../spraak/SpraakContext.tsx'

export const BehandlingAvInformasjonAccordion = () => {
    const spraak = useSpraak()

    const { innhold, innholdError, innholdIsLoading } = useSanityInnhold<BehandlingAvInformasjonAccordionInnhold>(
        '*[_type == "behandlingAvInformasjonAccordion"]'
    )

    if (innholdIsLoading) {
        return <KomponentLaster />
    }

    if (innholdError) {
        throw innholdError
    }

    return (
        !!innhold && (
            <Accordion>
                <Accordion.Item>
                    <Accordion.Header>{innhold?.informasjonViHenterItem?.tittel?.[spraak]}</Accordion.Header>
                    <Accordion.Content>
                        <SanityRikTekst text={innhold?.informasjonViHenterItem?.innhold?.[spraak]} />
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item>
                    <Accordion.Header>
                        {innhold?.hvordanViBehandlerPersonopplysningerItem?.tittel?.[spraak]}
                    </Accordion.Header>
                    <Accordion.Content>
                        <SanityRikTekst text={innhold?.hvordanViBehandlerPersonopplysningerItem?.innhold?.[spraak]} />

                        <BodyShort>
                            {
                                innhold?.hvordanViBehandlerPersonopplysningerItem
                                    ?.hvordanNavBehandlerPersonopplysningerSetning?.setningStart?.[spraak]
                            }{' '}
                            <Link
                                href={
                                    innhold?.hvordanViBehandlerPersonopplysningerItem
                                        ?.hvordanNavBehandlerPersonopplysningerSetning?.lenkeTilNav?.lenke?.[spraak]
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                inlineText
                            >
                                {
                                    innhold?.hvordanViBehandlerPersonopplysningerItem
                                        ?.hvordanNavBehandlerPersonopplysningerSetning?.lenkeTilNav?.tekst?.[spraak]
                                }
                            </Link>
                        </BodyShort>
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion>
        )
    )
}
