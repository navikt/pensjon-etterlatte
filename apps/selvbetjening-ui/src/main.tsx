import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@navikt/ds-css'
import { fetcher } from './common/api/api.ts'
import { SWRConfig } from 'swr'
import { ProvideSpraakContext } from './common/spraak/SpraakContext.tsx'
import { InntektsjusteringRoot } from './inntektsjustering/InntektjusteringRoot.tsx'
import { ProvideInnloggetInnbyggerContext } from './common/innloggetInnbygger/InnloggetInnbyggerContext.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <SWRConfig
            value={{
                fetcher: fetcher,
                shouldRetryOnError: false,
                revalidateOnFocus: false,
            }}
        >
            <ProvideSpraakContext>
                <ProvideInnloggetInnbyggerContext>
                    <InntektsjusteringRoot />
                </ProvideInnloggetInnbyggerContext>
            </ProvideSpraakContext>
        </SWRConfig>
    </StrictMode>
)
