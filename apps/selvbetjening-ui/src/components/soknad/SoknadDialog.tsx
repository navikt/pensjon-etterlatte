import { useEffect } from "react";
import { Route, useRouteMatch } from "react-router";
import Stegindikator from "nav-frontend-stegindikator/lib/stegindikator";
import { useStegContext } from "../../context/steg/StegContext";
import { useHistory } from "react-router-dom";
import { StegActionTypes, StegPath } from "../../context/steg/steg";
import Panel from "nav-frontend-paneler";
import { useTranslation } from "react-i18next";
import SoeknadType from "../../components/soknad/1-type/SoeknadType";
import OpplysningerOmSokeren from "../../components/soknad/2-soker/OpplysningerOmSokeren";
import OmDenAvdode from "../../components/soknad/3-avdod/OmDenAvdode";
import OpplysningerOmBarn from "../../components/soknad/4-barn/OpplysningerOmBarn";
import TidligereArbeidsforhold from "../../components/soknad/5-tidligerearbeidsforhold/TidligereArbeidsforhold";
import NavaerendeArbeidsforhold from "../../components/soknad/6-arbeidsforhold/NavaerendeArbeidsforhold";
import AndreYtelser from "../../components/soknad/7-andreytelser/AndreYtelser";

const SoknadDialog = () => {
    const history = useHistory();

    const { t } = useTranslation();
    const { path } = useRouteMatch();

    const { state, dispatch } = useStegContext();

    const { aktivtSteg, steg } = state;

    useEffect(() => {
        history.push(`/soknad/steg/${aktivtSteg}`);
    }, [history, aktivtSteg]);

    const forrige = () => dispatch({ type: StegActionTypes.FORRIGE });
    const neste = () => dispatch({ type: StegActionTypes.NESTE });
    const tilOppsummering = () => history.push("/soknad/oppsummering");

    const alleSteg = steg.map(({ label, disabled }, index) => {
        return { index, label: t(`steg.${label}`), disabled };
    });

    return (
        <>
            {aktivtSteg && (
                <Stegindikator
                    aktivtSteg={steg.findIndex((value) => value.path === aktivtSteg)}
                    steg={alleSteg}
                />
            )}

            <Panel>
                <Route path={`${path}/${StegPath.SoknadType}`} render={() => <SoeknadType neste={neste} />} />
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
                    render={() => <AndreYtelser neste={tilOppsummering} forrige={forrige} />}
                />
            </Panel>
        </>
    );
};

export default SoknadDialog;
