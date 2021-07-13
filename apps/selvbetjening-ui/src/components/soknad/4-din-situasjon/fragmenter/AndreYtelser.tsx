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

            <RHFToValgRadio
                name={"andreYtelser.kravOmAnnenStonad.svar"}
                legend={"Har du søkt om andre ytelser fra NAV som du ikke har fått svar på?"}
            />

            {kravOmAnnenStonad === IValg.JA && (
                <SkjemaGruppe>
                    <RHFInput
                        bredde={"XXL"}
                        name={"andreYtelser.kravOmAnnenStonad.beskrivelse"}
                        label={"Hva har du søkt om?"}
                    />
                </SkjemaGruppe>
            )}

            <RHFToValgRadio
                name={"andreYtelser.mottarPensjonUtland.svar"}
                legend={"Får du pensjon fra utlandet?"}
            />

            {mottarPensjonUtland === IValg.JA && (
                <>
                    <SkjemaGruppe>
                        <RHFInput
                            bredde={"XXL"}
                            name={"andreYtelser.mottarPensjonUtland.hvaSlagsPensjon"}
                            label={t("andreYtelser.mottarPensjonUtland.hvaSlagsPensjon")}
                        />
                    </SkjemaGruppe>

                    <SkjemaGruppe>
                        <RHFInput
                            bredde={"L"}
                            name={"andreYtelser.mottarPensjonUtland.fraHvilketLand"}
                            label={t("andreYtelser.mottarPensjonUtland.fraHvilketLand")}
                        />
                    </SkjemaGruppe>

                    <SkjemaGruppe>
                        <RHFInput
                            bredde={"L"}
                            name={"andreYtelser.mottarPensjonUtland.bruttobeloepPrAar"}
                            label={t("andreYtelser.mottarPensjonUtland.bruttobeloepPrAar")}
                        />
                    </SkjemaGruppe>
                </>
            )}
        </div>
    );
};

export default AndreYtelser;
