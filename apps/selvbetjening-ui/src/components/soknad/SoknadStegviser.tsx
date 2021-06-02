import Stegindikator from "nav-frontend-stegindikator/lib/stegindikator";
import { useStegContext } from "../../context/steg/StegContext";
import { useTranslation } from "react-i18next";

const SoknadStegviser = () => {
    const { t } = useTranslation();

    const {
        state: { aktivtSteg, steg }
    } = useStegContext();

    const alleSteg = steg.map(({ label, disabled }, index) => {
        return { index, label: t(`steg.${label}`), disabled };
    });

    return (
        <Stegindikator
            aktivtSteg={steg.findIndex((value) => value.path === aktivtSteg)}
            steg={alleSteg}
        />
    )
}

export default SoknadStegviser;
