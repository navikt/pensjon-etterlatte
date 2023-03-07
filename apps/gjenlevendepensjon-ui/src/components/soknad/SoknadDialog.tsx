import { Route, useRouteMatch } from "react-router";
import { useHistory, useLocation } from "react-router-dom";
import {IStegElement, MuligeSteg, StegPath} from "../../typer/steg";
import OmDeg from "./1-omdeg/OmDeg";
import OmDegOgAvdoed from "./2-omdegogavdoed/OmDegOgAvdoed";
import OmDenAvdode from "./3-avdod/OmDenAvdode";
import OpplysningerOmBarn from "./5-barn/OpplysningerOmBarn";
import Oppsummering from "./6-oppsummering/Oppsummering";
import DinSituasjon from "./4-din-situasjon/DinSituasjon";
import { useLanguage } from "../../hooks/useLanguage";
import {Stepper} from "@navikt/ds-react";
import {useTranslation} from "react-i18next";
import { v4 as uuid } from 'uuid'
import {useState} from "react";
import {isDev} from "../../api/axios";

const SoknadDialog = () => {
    const history = useHistory();
    const { t } = useTranslation();

    const { path } = useRouteMatch();
    const location = useLocation();
    useLanguage();

    const muligeSteg = MuligeSteg;
    const naavaerendePath = location.pathname.match(/[^/]+$/) || []
    const aktivtSteg = muligeSteg.findIndex((step) => naavaerendePath[0] === step.path)

    const [besoekteSteg, setBesoekteSteg] = useState<IStegElement[]>(muligeSteg.slice(0, aktivtSteg + 1))

    const settSteg = (stegIndex: number) => {
        const steg = muligeSteg[stegIndex]
        setBesoekteSteg([...besoekteSteg, steg])
        history.push(`/skjema/steg/${steg.path}`)
    };

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

            <>
                <Route path={`${path}/${StegPath.OmDeg}`} render={() => <OmDeg neste={neste} />} />
                <Route path={`${path}/${StegPath.OmDegOgAvdoed}`} render={() => <OmDegOgAvdoed neste={neste} forrige={forrige} />} />
                <Route path={`${path}/${StegPath.OmAvdoed}`} render={() => <OmDenAvdode neste={neste} forrige={forrige} />} />
                <Route path={`${path}/${StegPath.DinSituasjon}`} render={() => <DinSituasjon neste={neste} forrige={forrige} />} />
                <Route path={`${path}/${StegPath.OmBarn}`} render={() => <OpplysningerOmBarn neste={neste} forrige={forrige} />} />
                <Route path={`${path}/${StegPath.Oppsummering}`} render={() => <Oppsummering forrige={forrige} />} />
            </>
        </>
    );
};

export default SoknadDialog;
