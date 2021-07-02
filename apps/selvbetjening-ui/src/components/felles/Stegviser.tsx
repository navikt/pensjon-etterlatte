import Stegindikator from "nav-frontend-stegindikator/lib/stegindikator";
import { useStegContext } from "../../context/steg/StegContext";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { SkjemaGruppe } from "nav-frontend-skjema";

const Stegviser = () => {
    const { t } = useTranslation();

    const location = useLocation()

    const { state: { steg } } = useStegContext();

    const alleSteg = steg.map(({ label, disabled }, index) => {
        return { index, label: t(`steg.${label}`), disabled };
    });

    const matchAktivtSteg = location.pathname.match(/[^/]+$/) || []

    const finnAktivtSteg = () => steg.findIndex(value => value.path === matchAktivtSteg[0]);

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
