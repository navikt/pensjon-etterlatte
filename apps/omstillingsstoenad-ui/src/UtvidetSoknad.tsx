import { SkjemaTittelUtvidet } from '~components/felles/SkjemaTittelUtvidet'
import { useHentBrukerContext } from '~context/utvidet/HentBrukerContext'

export const UtvidetSoknad = () => {
    const { bruker, lasterBruker } = useHentBrukerContext()

    console.log('bruker', bruker)
    console.log('lasterBruker', lasterBruker)
    return (
        <>
            <SkjemaTittelUtvidet />
        </>
    )
}
