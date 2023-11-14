import { Route, Routes } from 'react-router'
import { useNavigate, useLocation } from 'react-router-dom'
import { IStegElement, MuligeSteg, StegPath } from '../../typer/steg'
import OmDeg from './1-omdeg/OmDeg'
import OmDegOgAvdoed from './2-omdegogavdoed/OmDegOgAvdoed'
import OmDenAvdode from './3-avdod/OmDenAvdode'
import SituasjonenDin from './4-situasjonen-din/SituasjonenDin'
import InntektenDin from './5-inntekten-din/InntektenDin'
import OpplysningerOmBarn from './6-barn/OpplysningerOmBarn'
import Oppsummering from './7-oppsummering/Oppsummering'
import { useLanguage } from '../../hooks/useLanguage'
import { useState } from 'react'
import Stegviser from '../felles/Stegviser'

const SoknadDialog = () => {
    const navigate = useNavigate()

    const { pathname } = useLocation()
    useLanguage()

    const muligeSteg = MuligeSteg
    const aktivtSteg = muligeSteg.findIndex((step) => pathname.replace('/skjema/steg/', '') === step.path)

    const [besoekteSteg, setBesoekteSteg] = useState<IStegElement[]>(muligeSteg.slice(0, aktivtSteg + 1))

    const settSteg = (stegIndex: number) => {
        const steg = muligeSteg[stegIndex]
        setBesoekteSteg([...besoekteSteg, steg])
        navigate(`/skjema/steg/${steg.path}`)
    }

    const neste = aktivtSteg < muligeSteg.length - 1 ? () => settSteg(aktivtSteg + 1) : undefined
    const forrige = aktivtSteg > 0 ? () => settSteg(aktivtSteg - 1) : undefined

    return (
        <>
            <Stegviser
                aktivtSteg={aktivtSteg}
                besoekteSteg={besoekteSteg}
                muligeSteg={muligeSteg}
                settSteg={settSteg}
            />

            <Routes>
                <Route path={`/${StegPath.OmDeg}`} element={<OmDeg neste={neste} />} />
                <Route path={`/${StegPath.OmAvdoed}`} element={<OmDenAvdode neste={neste} forrige={forrige} />} />
                <Route
                    path={`/${StegPath.OmDegOgAvdoed}`}
                    element={<OmDegOgAvdoed neste={neste} forrige={forrige} />}
                />
                <Route
                    path={`/${StegPath.DinSituasjon}`}
                    element={<SituasjonenDin neste={neste} forrige={forrige} />}
                />
                <Route path={`/${StegPath.InntektenDin}`} element={<InntektenDin neste={neste} forrige={forrige} />} />
                <Route path={`/${StegPath.OmBarn}`} element={<OpplysningerOmBarn neste={neste} forrige={forrige} />} />
                <Route path={`/${StegPath.Oppsummering}`} element={<Oppsummering forrige={forrige} />} />
            </Routes>
        </>
    )
}

export default SoknadDialog
