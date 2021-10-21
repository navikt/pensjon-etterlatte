import Stegindikator from "nav-frontend-stegindikator/lib/stegindikator";
import { useTranslation } from "react-i18next";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { MuligeSteg, StegPath } from "../../typer/steg";
import {  useLocation } from "react-router-dom";
import { isEmpty } from "lodash";
import { useSoknadContext } from "../../context/soknad/SoknadContext";

const Stegviser = () => {
    const { t } = useTranslation();
    const location = useLocation();
    //const history = useHistory();
    const { state } = useSoknadContext();
    const steg = MuligeSteg;


    const matchAktivtSteg = location.pathname.match(/[^/]+$/) || []
    const finnAktivtSteg = () => steg.findIndex(value => value.path === matchAktivtSteg[0]);
    const finnStegIndeks = (validertSteg: StegPath) => steg.findIndex(value => value.path === validertSteg)

    const finnSisteValiderteSteg = () => {
        if (!isEmpty(state.opplysningerOmBarn)) {
            return finnStegIndeks(StegPath.OmBarn);
        } else if (!isEmpty(state.dinSituasjon)) {
            return finnStegIndeks(StegPath.OmDeg);
        } else if (!isEmpty(state.omDenAvdoede)) {
            return finnStegIndeks(StegPath.OmAvdoed);
        } else if (!isEmpty(state.omDegOgAvdoed)) {
            return finnStegIndeks(StegPath.OmDegOgAvdoed);
        } else if (!isEmpty(state.omDeg)) {
            return finnStegIndeks(StegPath.OmDeg);
        } else {
            return finnStegIndeks(StegPath.OmDeg);
        }
    }

    const alleSteg = steg.map(({ label }, index) => {
        return {
            index,
            label: t(`steg.${label}`),
            disabled: index > finnSisteValiderteSteg() +1
        };
    });

    //TODO: legge til lagring og validering.
/*
    const settSteg = (nyIndex: number) => {
        const nyttSteg = steg[nyIndex]
        history.push(`/soknad/steg/${nyttSteg.path}`)
    };

    const onChange = (index: number) => {
        settSteg(index)
    }

    const onBeforeChange = (nyIndex: number) => {
        console.log("NYINDEX: " + nyIndex)
        if (nyIndex === 0 ) {
            return true
        } else if ( nyIndex === 1) {
           return true
        }

        else {
            return true
        }

    }*/

    return (
        <SkjemaGruppe>
            <Stegindikator
                aktivtSteg={finnAktivtSteg()}
                steg={alleSteg}
                //onBeforeChange={onBeforeChange}
                //onChange={onChange}
                autoResponsiv={true}
                visLabel={false}
            />
        </SkjemaGruppe>
    )
}

export default Stegviser;
