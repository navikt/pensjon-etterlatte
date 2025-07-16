import { Route, Routes } from 'react-router'
import { useLocation, useNavigate } from 'react-router-dom'
import { SkjemaProgresjon } from '~components/felles/SkjemaProgresjon'
import { useLanguage } from '../../hooks/useLanguage'
import { MuligeSteg, StegPath } from '../../typer/steg'
import OmDeg from './1-omdeg/OmDeg'
import OmDegOgAvdoed from './2-omdegogavdoed/OmDegOgAvdoed'
import OmDenAvdode from './3-avdod/OmDenAvdode'
import SituasjonenDin from './4-situasjonen-din/SituasjonenDin'
import MerOmSituasjonenDin from './5-mer-om-situasjonen-din/MerOmSituasjonenDin'
import InntektenDin from './6-inntekten-din/InntektenDin'
import OpplysningerOmBarnepensjon from './7-barnepensjon/OpplysningerOmBarnepensjon'
import Oppsummering from './8-oppsummering/Oppsummering'

const SoknadDialog = () => {
    const navigate = useNavigate()

    const { pathname } = useLocation()
    useLanguage()

    const muligeSteg = MuligeSteg
    const aktivtSteg = muligeSteg.findIndex((step) => pathname.replace('/skjema/steg/', '') === step.path)

    const settSteg = (stegIndex: number) => {
        const steg = muligeSteg[stegIndex]
        navigate(`/skjema/steg/${steg.path}`)
    }

    const neste = aktivtSteg < muligeSteg.length - 1 ? () => settSteg(aktivtSteg + 1) : undefined
    const forrige = aktivtSteg > 0 ? () => settSteg(aktivtSteg - 1) : undefined

    return (
        <>
            <SkjemaProgresjon aktivtSteg={aktivtSteg} muligeSteg={muligeSteg} settSteg={settSteg} />

            <Routes>
                <Route path={`/${StegPath.OmDeg}`} element={<OmDeg neste={neste} />} />
                <Route path={`/${StegPath.OmAvdoed}`} element={<OmDenAvdode neste={neste} forrige={forrige} />} />
                <Route
                    path={`/${StegPath.OmDegOgAvdoed}`}
                    element={<OmDegOgAvdoed neste={neste} forrige={forrige} />}
                />
                <Route
                    path={`/${StegPath.SituasjonenDin}`}
                    element={<SituasjonenDin neste={neste} forrige={forrige} />}
                />
                <Route
                    path={`/${StegPath.MerOmSituasjonenDin}`}
                    element={<MerOmSituasjonenDin neste={neste} forrige={forrige} />}
                />
                <Route path={`/${StegPath.InntektenDin}`} element={<InntektenDin neste={neste} forrige={forrige} />} />
                <Route
                    path={`/${StegPath.OmBarn}`}
                    element={<OpplysningerOmBarnepensjon neste={neste} forrige={forrige} />}
                />
                <Route path={`/${StegPath.Oppsummering}`} element={<Oppsummering forrige={forrige} />} />
            </Routes>
        </>
    )
}

export default SoknadDialog
