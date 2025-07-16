import { Box, Select, VStack } from '@navikt/ds-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useBrukerContext } from '../../context/bruker/BrukerContext'
import { useSoknadContext } from '../../context/soknad/SoknadContext'
import { ActionTypes } from '../../context/soknad/soknad'
import { Language } from '../../i18n'

export const Spraakvalg = () => {
    const { t } = useTranslation()
    const { state: soknadState, dispatch: soknadDispatch } = useSoknadContext()
    const { state: brukerState } = useBrukerContext()

    const personHarStoettetSpraakvalg = () => Object.values<string>(Language).includes(brukerState?.spraak || '')
    const oppdaterSpraak = (spraak: string) =>
        soknadDispatch({
            type: ActionTypes.OPPDATER_SPRAAK,
            payload: spraak,
        })

    useEffect(() => {
        // Benytt språk fra KRR dersom det finnes, hvis ikke sett norsk bokmål som default.
        if (!soknadState.spraak && personHarStoettetSpraakvalg()) {
            oppdaterSpraak(brukerState.spraak!)
        } else if (!soknadState.spraak && Object.keys(brukerState).length !== 0 && !brukerState.spraak) {
            oppdaterSpraak(Language.NORSK_BOKMAAL)
        }
    }, [soknadState.spraak, brukerState.spraak])

    return (
        <VStack marginBlock="0 12" align="center">
            <Box width="12rem">
                <Select
                    onChange={(e) => oppdaterSpraak(e.target.value)}
                    value={soknadState.spraak}
                    label={t('felles.spraakValg')}
                >
                    <option value={Language.NORSK_BOKMAAL}>Bokmål</option>
                    <option value={Language.NORSK_NYNORSK}>Nynorsk</option>
                    <option value={Language.ENGELSK}>English</option>
                </Select>
            </Box>
        </VStack>
    )
}
