import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@navikt/ds-css'
import { fetcher } from './utils/api.ts'
import { SWRConfig } from 'swr'
import { ProvideSpraakContext } from './common/spraak/SpraakContext.tsx'
import { InntektsjusteringRoot } from './inntektsjustering/InntektjusteringRoot.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ProvideSpraakContext>
            <SWRConfig
                value={{
                    fetcher: fetcher,
                    shouldRetryOnError: false,
                    revalidateOnFocus: false,
                }}
            >
                <InntektsjusteringRoot />
            </SWRConfig>
        </ProvideSpraakContext>
    </StrictMode>
)
