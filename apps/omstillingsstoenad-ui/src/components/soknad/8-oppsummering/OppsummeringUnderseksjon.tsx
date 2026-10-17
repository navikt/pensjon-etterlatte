import { Box, FormSummary, Heading } from '@navikt/ds-react'
import { ReactNode } from 'react'

interface Props {
    tittel: string
    children: ReactNode
}

/** Seksjonen rundt må bruke medSvarliste={false}, slik at svarlistene ikke nøstes. */
export const OppsummeringUnderseksjon = ({ tittel, children }: Props) => {
    return (
        <section>
            <Box
                asChild
                paddingInline={{ xs: 'space-16', sm: 'space-20' }}
                paddingBlock={{ xs: 'space-12 space-0', sm: 'space-16 space-0' }}
            >
                <Heading level="3" size="small">
                    {tittel}
                </Heading>
            </Box>
            <FormSummary.Answers>{children}</FormSummary.Answers>
        </section>
    )
}
