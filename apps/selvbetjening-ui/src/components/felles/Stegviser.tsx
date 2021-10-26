import Stegindikator from "nav-frontend-stegindikator/lib/stegindikator";
import { useTranslation } from "react-i18next";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { MuligeSteg } from "../../typer/steg";
import {  useLocation } from "react-router-dom";

const Stegviser = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const steg = MuligeSteg;

    const matchAktivtSteg = location.pathname.match(/[^/]+$/) || []
    const finnAktivtSteg = () => steg.findIndex(value => value.path === matchAktivtSteg[0]);

    const alleSteg = steg.map(({ label }, index) => {
        return {
            index,
            label: t(`steg.${label}`)
        };
    });

    return (
        <SkjemaGruppe>
            <Stegindikator
                aktivtSteg={finnAktivtSteg()}
                steg={alleSteg}
            />
        </SkjemaGruppe>
    )
}

export default Stegviser;
