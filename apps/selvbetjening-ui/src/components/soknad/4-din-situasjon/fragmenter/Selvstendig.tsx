import { RHFInput } from "../../../felles/RHFInput";
import { SkjemaGruppe } from "nav-frontend-skjema";
import Datovelger from "../../../felles/Datovelger";
import { Undertittel } from "nav-frontend-typografi";
import { useTranslation } from "react-i18next";

const Selvstendig = () => {
    const { t } = useTranslation();

    return (
        <>
            <SkjemaGruppe>
                <Undertittel>{t("dinSituasjon.selvstendig.tittel")}</Undertittel>
            </SkjemaGruppe>

            <SkjemaGruppe className={"rad"}>
                <RHFInput
                    className={"kol-75"}
                    name={"selvstendig.beskrivelse"}
                    label={t("dinSituasjon.selvstendig.beskrivelse")}
                />

                <Datovelger
                    name={"selvstendig.startDato"}
                    label={t("dinSituasjon.selvstendig.startDato")}
                />
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFInput
                    name={"selvstendig.type"}
                    label={t("dinSituasjon.selvstendig.type")}
                />
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFInput
                    name={"selvstendig.endringIfmDoedsfall"}
                    label={t("dinSituasjon.selvstendig.endringIfmDoedsfall")}
                    placeholder={t("dinSituasjon.selvstendig.endringIfmDoedsfallPlaceholder")}
                />
            </SkjemaGruppe>
        </>
    );
}

export default Selvstendig;
