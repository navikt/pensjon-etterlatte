import { Route, Routes } from 'react-router'
import { useNavigate, useLocation } from 'react-router-dom'
import { IStegElement, MuligeSteg, StegPath } from '../../typer/steg'
import OmDeg from './1-omdeg/OmDeg'
import OmDegOgAvdoed from './2-omdegogavdoed/OmDegOgAvdoed'
import OmDenAvdode from './3-avdod/OmDenAvdode'
import OpplysningerOmBarn from './5-barn/OpplysningerOmBarn'
import Oppsummering from './6-oppsummering/Oppsummering'
import DinSituasjon from './4-din-situasjon/DinSituasjon'
import { useLanguage } from '../../hooks/useLanguage'
import { Stepper } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import { v4 as uuid } from 'uuid'
import { useState } from 'react'
import { isDev } from '../../api/axios'

const SoknadDialog = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()

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
            <Stepper
                activeStep={aktivtSteg + 1}
                onStepChange={(step) => isDev && settSteg(step - 1)}
                orientation={'horizontal'}
                interactive={isDev}
            >
                {muligeSteg.map((steg) => (
                    <Stepper.Step key={uuid()} interactive={besoekteSteg.includes(steg)}>
                        {t(steg.label)}
                    </Stepper.Step>
                ))}
            </Stepper>

            <Routes>
                <Route path={`/${StegPath.OmDeg}`} element={<OmDeg neste={neste} />} />
                <Route
                    path={`/${StegPath.OmDegOgAvdoed}`}
                    element={<OmDegOgAvdoed neste={neste} forrige={forrige} />}
                />
                <Route path={`/${StegPath.OmAvdoed}`} element={<OmDenAvdode neste={neste} forrige={forrige} />} />
                <Route path={`/${StegPath.DinSituasjon}`} element={<DinSituasjon neste={neste} forrige={forrige} />} />
                <Route path={`/${StegPath.OmBarn}`} element={<OpplysningerOmBarn neste={neste} forrige={forrige} />} />
                <Route path={`/${StegPath.Oppsummering}`} element={<Oppsummering forrige={forrige} />} />
            </Routes>
        </>
    )
}

export default SoknadDialog
