import Datovelger from "../../../felles/Datovelger";
import SamboerSkjema from "./SamboerSkjema";
import { ISoeker, OpploesningAarsak } from "../../../../typer/person";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { SkjemaGruppe } from "nav-frontend-skjema";

const NyttSamboerskap = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoeker>();

    const aarsakForOpploesningen = watch("nySivilstatus.samboerskap.aarsakForOpploesningen");

    return (
        <>
            <SkjemaGruppe>
                <SamboerSkjema/>
            </SkjemaGruppe>

            {aarsakForOpploesningen === OpploesningAarsak.samlivsbrudd && (
                <SkjemaGruppe>
                    <Datovelger
                        name={"nySivilstatus.samboerskap.opploestDato"}
                        label={t("omDegOgAvdoed.nySivilstatus.samboerskap.opploestDato")}
                        maxDate={new Date()}
                    />
                </SkjemaGruppe>
            )}
        </>
    );
};

export default NyttSamboerskap;
