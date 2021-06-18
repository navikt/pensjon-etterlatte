import Stegindikator from "nav-frontend-stegindikator/lib/stegindikator";
import { useStegContext } from "../../context/steg/StegContext";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { IStegElement } from "../../context/steg/steg";

const Stegviser = () => {
    const { t } = useTranslation();

    const location = useLocation()

    const { state: { steg } } = useStegContext();

    const alleSteg = steg.map(({ label, disabled }, index) => {
        return { index, label: t(`steg.${label}`), disabled };
    });

    const finnAktivtSteg = (value: IStegElement) => location.pathname.includes(value.path);

    return (
        <Stegindikator
            aktivtSteg={steg.findIndex(finnAktivtSteg)}
            steg={alleSteg}
        />
    )
}

export default Stegviser;
