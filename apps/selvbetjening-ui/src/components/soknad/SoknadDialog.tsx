import { Route, useRouteMatch } from "react-router";
import { useStegContext } from "../../context/steg/StegContext";
import { useHistory, useLocation } from "react-router-dom";
import { StegPath } from "../../context/steg/steg";
import OmSoeknaden from "./1-intro/OmSoeknaden";
import OmDeg from "./2-omdeg/OmDeg";
import OmDenAvdode from "../../components/soknad/3-avdod/OmDenAvdode";
import OpplysningerOmBarn from "../../components/soknad/4-barn/OpplysningerOmBarn";
import Stegviser from "../felles/Stegviser";
import Oppsummering from "./8-oppsummering/Oppsummering";
import { useSoknadContext } from "../../context/soknad/SoknadContext";
import DinSituasjon from "./4-din-situasjon/DinSituasjon";

const SoknadDialog = () => {
    const history = useHistory();

    const { path } = useRouteMatch();
    const location = useLocation();

    const { state: { steg } } = useStegContext();

    const { state: { harSamtykket }} = useSoknadContext();

    if (!harSamtykket) {
        history.push("/")
    }

    const settSteg = (retning: -1 | 1) => {
        const index = steg.findIndex((value) => location.pathname.includes(value.path))
        const nesteSteg = steg[index + retning]

        history.push(`/soknad/steg/${nesteSteg.path}`)
    }

    const forrige = () => settSteg(-1)
    const neste = () => settSteg(1)

    return (
        <>
            <Stegviser />

            <>
                <Route path={`${path}/${StegPath.OmSoeknaden}`} render={() => <OmSoeknaden neste={neste} />} />
                <Route path={`${path}/${StegPath.OmDeg}`} render={() => <OmDeg neste={neste} forrige={forrige} />} />
                <Route path={`${path}/${StegPath.OmAvdoed}`} render={() => <OmDenAvdode neste={neste} forrige={forrige} />} />
                <Route path={`${path}/${StegPath.DinSituasjon}`} render={() => <DinSituasjon neste={neste} forrige={forrige} />} />
                <Route path={`${path}/${StegPath.OmBarn}`} render={() => <OpplysningerOmBarn neste={neste} forrige={forrige} />} />
                <Route path={`${path}/${StegPath.Oppsummering}`} render={() => <Oppsummering forrige={forrige} />} />
            </>
        </>
    );
};

export default SoknadDialog;
