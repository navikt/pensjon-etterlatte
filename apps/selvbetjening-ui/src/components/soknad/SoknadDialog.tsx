import { Route, useRouteMatch } from "react-router";
import { useStegContext } from "../../context/steg/StegContext";
import { useHistory, useLocation } from "react-router-dom";
import { StegPath } from "../../context/steg/steg";
import Panel from "nav-frontend-paneler";
import SoekerSituasjon from "./1-situasjon/SoekerSituasjon";
import OpplysningerOmSokeren from "../../components/soknad/2-soker/OpplysningerOmSokeren";
import OmDenAvdode from "../../components/soknad/3-avdod/OmDenAvdode";
import OpplysningerOmBarn from "../../components/soknad/4-barn/OpplysningerOmBarn";
import TidligereArbeidsforhold from "../../components/soknad/5-tidligerearbeidsforhold/TidligereArbeidsforhold";
import NavaerendeArbeidsforhold from "../../components/soknad/6-arbeidsforhold/NavaerendeArbeidsforhold";
import AndreYtelser from "../../components/soknad/7-andreytelser/AndreYtelser";
import Stegviser from "../felles/Stegviser";
import Oppsummering from "./8-oppsummering/Oppsummering";
import { useSoknadContext } from "../../context/soknad/SoknadContext";

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

            <Panel>
                <Route path={`${path}/${StegPath.DinSituasjon}`} render={() => <SoekerSituasjon neste={neste} />} />
                <Route
                    path={`${path}/${StegPath.OmSoekeren}`}
                    render={() => <OpplysningerOmSokeren neste={neste} forrige={forrige} />}
                />
                <Route
                    path={`${path}/${StegPath.OmAvdoed}`}
                    render={() => <OmDenAvdode neste={neste} forrige={forrige} />}
                />
                <Route
                    path={`${path}/${StegPath.OmBarn}`}
                    render={() => <OpplysningerOmBarn neste={neste} forrige={forrige} />}
                />
                <Route
                    path={`${path}/${StegPath.TidlArbeidsforhold}`}
                    render={() => <TidligereArbeidsforhold neste={neste} forrige={forrige} />}
                />
                <Route
                    path={`${path}/${StegPath.Arbeidsforhold}`}
                    render={() => <NavaerendeArbeidsforhold neste={neste} forrige={forrige} />}
                />
                <Route
                    path={`${path}/${StegPath.AndreYtelser}`}
                    render={() => <AndreYtelser neste={neste} forrige={forrige} />}
                />
                <Route
                    path={`${path}/${StegPath.Oppsummering}`}
                    render={() => <Oppsummering forrige={forrige} />}
                />
            </Panel>
        </>
    );
};

export default SoknadDialog;
