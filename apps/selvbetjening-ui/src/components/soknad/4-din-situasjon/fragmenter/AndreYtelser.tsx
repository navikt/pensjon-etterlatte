import { SkjemaGruppe } from "nav-frontend-skjema";
import { Undertittel } from "nav-frontend-typografi";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { RHFToValgRadio } from "../../../felles/RHFRadio";
import { RHFInput } from "../../../felles/RHFInput";
import { IValg } from "../../../../typer/Spoersmaal";
import { ISituasjon } from "../../../../typer/situasjon";

const AndreYtelser = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISituasjon>();

    const kravOmAnnenStonad = watch("andreYtelser.kravOmAnnenStonad.svar")
    const mottarPensjonUtland = watch("andreYtelser.mottarPensjonUtland.svar")

    return (
        <div>
            {/* Steg 7 */}
            <SkjemaGruppe>
                <Undertittel>
                    Ytelser
                </Undertittel>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFToValgRadio
                    name={"andreYtelser.kravOmAnnenStonad.svar"}
                    legend={t("andreYtelser.kravOmAnnenStonad.svar")}
                />
            </SkjemaGruppe>

            {kravOmAnnenStonad === IValg.JA && (
                <SkjemaGruppe>
                    <RHFInput
                        bredde={"L"}
                        name={"andreYtelser.kravOmAnnenStonad.beskrivelse"}
                        label={t("andreYtelser.kravOmAnnenStonad.beskrivelse")}
                    />
                </SkjemaGruppe>
            )}

            <SkjemaGruppe>
                <RHFToValgRadio
                    name={"andreYtelser.mottarPensjonUtland.svar"}
                    legend={t("andreYtelser.mottarPensjonUtland.svar")}
                />
            </SkjemaGruppe>

            {mottarPensjonUtland === IValg.JA && (
                <div>
                    <fieldset className={"rad skjemagruppe"}>
                        <RHFInput
                            bredde={"L"}
                            className={"kolonne"}
                            name={"andreYtelser.mottarPensjonUtland.hvaSlagsPensjon"}
                            label={t("andreYtelser.mottarPensjonUtland.hvaSlagsPensjon")}
                        />

                        <RHFInput
                            bredde={"S"}
                            className={"kolonne"}
                            name={"andreYtelser.mottarPensjonUtland.fraHvilketLand"}
                            label={t("andreYtelser.mottarPensjonUtland.fraHvilketLand")}
                        />
                    </fieldset>

                    <fieldset className={"rad skjemagruppe"}>
                        <RHFInput
                            bredde={"M"}
                            className={"kolonne"}
                            name={"andreYtelser.mottarPensjonUtland.bruttobeloepPrAar"}
                            label={t("andreYtelser.mottarPensjonUtland.bruttobeloepPrAar")}
                        />

                        <RHFInput
                            bredde={"M"}
                            className={"kolonne"}
                            name={"andreYtelser.mottarPensjonUtland.landetsValuta"}
                            label={t("andreYtelser.mottarPensjonUtland.landetsValuta")}
                        />
                    </fieldset>
                </div>
            )}
        </div>
    );
};

export default AndreYtelser;
