import { Route, useRouteMatch } from "react-router";
import { useHistory, useLocation } from "react-router-dom";
import { MuligeSteg, StegPath } from "../../typer/steg";
import OmDeg from "./1-omdeg/OmDeg";
import OmDegOgAvdoed from "./2-omdegogavdoed/OmDegOgAvdoed";
import OmDenAvdode from "./3-avdod/OmDenAvdode";
import OpplysningerOmBarn from "./5-barn/OpplysningerOmBarn";
import Stegviser from "../felles/Stegviser";
import Oppsummering from "./6-oppsummering/Oppsummering";
import DinSituasjon from "./4-din-situasjon/DinSituasjon";
import { useLanguage } from "../../hooks/useLanguage";

const SoknadDialog = () => {
    const history = useHistory();

    const { path } = useRouteMatch();
    const location = useLocation();
    useLanguage();

    const steg = MuligeSteg;

    const settSteg = (retning: -1 | 1) => {
        const matchAktivtSteg = location.pathname.match(/[^/]+$/) || []
        const index = steg.findIndex(value => value.path === matchAktivtSteg[0]);

        const nesteSteg = steg[index + retning]

        history.push(`/skjema/steg/${nesteSteg.path}`)
    };

    const forrige = () => settSteg(-1)
    const neste = () => settSteg(1);

    return (
        <>
            <Stegviser />

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
