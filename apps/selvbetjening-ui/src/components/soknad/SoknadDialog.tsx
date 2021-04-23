import { useEffect } from "react";
import { Route, useRouteMatch } from "react-router";
import Stegindikator from "nav-frontend-stegindikator/lib/stegindikator";
import { useStegContext } from "../../context/steg/StegContext";
import { useHistory } from "react-router-dom";
import { StegActionTypes } from "../../context/steg/steg";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import { Panel } from "nav-frontend-paneler";
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
        console.log("useEffect");
        history.push(`/soknad/steg/${aktivtSteg}`);
    }, [history, aktivtSteg]);

    const forrige = () => dispatch({ type: StegActionTypes.FORRIGE });
    const neste = () => dispatch({ type: StegActionTypes.NESTE });

    const alleSteg = steg.map(({ label, disabled }, index) => {
        return { index, label, disabled };
    });

    return (
        <>
            {aktivtSteg && (
                <Stegindikator
                    aktivtSteg={aktivtSteg - 1}
                    steg={alleSteg}
                    onChange={(index) => {
                        dispatch({ type: StegActionTypes.SETT_STEG, payload: index });
                    }}
                />
            )}

            <Panel>
                <Route path={`${path}/1`} component={SoeknadType} />
                <Route path={`${path}/2`} component={OpplysningerOmSokeren} />
                <Route path={`${path}/3`} component={OmDenAvdode} />
                <Route path={`${path}/4`} component={OpplysningerOmBarn} />
                <Route path={`${path}/5`} component={TidligereArbeidsforhold} />
                <Route path={`${path}/6`} component={NavaerendeArbeidsforhold} />
                <Route path={`${path}/7`} component={AndreYtelser} />
            </Panel>

            <section className={"navigasjon-rad"}>
                {aktivtSteg > 1 && <Knapp onClick={forrige}>{t("knapp.tilbake")}</Knapp>}

                {aktivtSteg < steg.length && <Hovedknapp onClick={neste}>{t("knapp.neste")}</Hovedknapp>}

                {aktivtSteg === steg.length && (
                    <Hovedknapp onClick={() => history.push("/soknad/oppsummering")}>
                        {t("knapp.tilOppsummering")}
                    </Hovedknapp>
                )}
            </section>
        </>
    );
};

export default SoknadDialog;
