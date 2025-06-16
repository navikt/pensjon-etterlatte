import { Accordion, BodyShort, Link } from '@navikt/ds-react'
import { KomponentLaster } from '../KomponentLaster.tsx'
import { BehandlingAvInformasjonAccordion as BehandlingAvInformasjonAccordionInnhold } from '../sanity.types.ts'
import { SanityRikTekst } from '../sanity/SanityRikTekst.tsx'
import { useSanityInnhold } from '../sanity/useSanityInnhold.ts'
import { useSpraak } from '../spraak/SpraakContext.tsx'

export const BehandlingAvInformasjonAccordion = () => {
    const spraak = useSpraak()

    const { innhold, error, isLoading } = useSanityInnhold<BehandlingAvInformasjonAccordionInnhold>(
        '*[_type == "behandlingAvInformasjonAccordion"]'
    )

    if (isLoading) {
        return <KomponentLaster />
    }

    if (error) {
        throw error
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
