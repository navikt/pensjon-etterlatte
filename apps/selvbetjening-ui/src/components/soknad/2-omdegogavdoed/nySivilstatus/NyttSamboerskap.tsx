import Datovelger from "../../../felles/Datovelger";
import { IValg } from "../../../../typer/Spoersmaal";
import SamboerSkjema from "./SamboerSkjema";
import { Alert } from "@navikt/ds-react";
import { ISoeker, OpploesningAarsak } from "../../../../typer/person";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { SkjemaGruppe } from "nav-frontend-skjema";

const NyttSamboerskap = ({ gyldigVarighet }: { gyldigVarighet?: IValg }) => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoeker>();

    const aarsakForOpploesningen = watch("nySivilstatus.samboerskap.aarsakForOpploesningen");

    return (
        <>
            <SkjemaGruppe>
                <SamboerSkjema />
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

            {gyldigVarighet === IValg.NEI && (
                <Alert variant={"warning"}>{t("omDegOgAvdoed.forholdTilAvdoede.ingenRettighetAdvarsel")}</Alert>
            )}
        </>
    );
};

export default NyttSamboerskap;
