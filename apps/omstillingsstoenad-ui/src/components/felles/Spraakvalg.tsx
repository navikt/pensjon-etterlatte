import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { SpraakvalgSelect } from '~components/felles/SpraakvalgSelect'
import { useBrukerContext } from '../../context/bruker/BrukerContext'
import { useSoknadContext } from '../../context/soknad/SoknadContext'
import { ActionTypes } from '../../context/soknad/soknad'
import { Language } from '../../i18n'

export const Spraakvalg = () => {
    const { t } = useTranslation()
    const { state: soknadState, dispatch: soknadDispatch } = useSoknadContext()
    const { state: brukerState } = useBrukerContext()

    const personHarStoettetSpraakvalg = () => Object.values<string>(Language).includes(brukerState?.spraak || '')
    const oppdaterSpraak = (spraak: Language) =>
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

    return <SpraakvalgSelect value={soknadState.spraak} onChange={oppdaterSpraak} label={t('felles.spraakValg')} />
}
