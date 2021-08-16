import { SkjemaGruppe } from "nav-frontend-skjema";
import { Undertittel } from "nav-frontend-typografi";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { RHFToValgRadio } from "../../../felles/RHFRadio";
import { RHFInput } from "../../../felles/RHFInput";
import { IValg } from "../../../../typer/Spoersmaal";
import { ISituasjon } from "../../../../typer/situasjon";
import HvorforSpoerVi from "../../../felles/HvorforSpoerVi";

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
                    {t("dinSituasjon.andreYtelser.tittel")}
                </Undertittel>
            </SkjemaGruppe>

            <RHFToValgRadio
                name={"andreYtelser.kravOmAnnenStonad.svar"}
                legend={t("dinSituasjon.andreYtelser.kravOmAnnenStonad.svar")}
                description={
                    <HvorforSpoerVi>{t("dinSituasjon.andreYtelser.kravOmAnnenStonad.hvorfor")}</HvorforSpoerVi>
                }
            />

            {kravOmAnnenStonad === IValg.JA && (
                <SkjemaGruppe>
                    <RHFInput
                        bredde={"XXL"}
                        name={"andreYtelser.kravOmAnnenStonad.beskrivelse"}
                        label={t("dinSituasjon.andreYtelser.kravOmAnnenStonad.beskrivelse")}
                    />
                </SkjemaGruppe>
            )}

            <RHFToValgRadio
                name={"andreYtelser.mottarPensjonUtland.svar"}
                legend={t("dinSituasjon.andreYtelser.mottarPensjonUtland.svar")}
                description={
                    <HvorforSpoerVi>{t("dinSituasjon.andreYtelser.mottarPensjonUtland.hvorfor")}</HvorforSpoerVi>
                }
            />

            {mottarPensjonUtland === IValg.JA && (
                <>
                    <SkjemaGruppe>
                        <RHFInput
                            bredde={"XXL"}
                            name={"andreYtelser.mottarPensjonUtland.hvaSlagsPensjon"}
                            label={t("dinSituasjon.andreYtelser.mottarPensjonUtland.hvaSlagsPensjon")}
                        />
                    </SkjemaGruppe>

                    <SkjemaGruppe>
                        <RHFInput
                            bredde={"L"}
                            name={"andreYtelser.mottarPensjonUtland.fraHvilketLand"}
                            label={t("dinSituasjon.andreYtelser.mottarPensjonUtland.fraHvilketLand")}
                        />
                    </SkjemaGruppe>

                    <SkjemaGruppe>
                        <RHFInput
                            bredde={"L"}
                            name={"andreYtelser.mottarPensjonUtland.bruttobeloepPrAar"}
                            label={t("dinSituasjon.andreYtelser.mottarPensjonUtland.bruttobeloepPrAar")}
                        />
                    </SkjemaGruppe>
                </>
            )}
        </div>
    );
};

export default AndreYtelser;
