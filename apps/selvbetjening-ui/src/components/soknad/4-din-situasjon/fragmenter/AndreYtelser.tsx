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
                legend={t("dinSituasjon.andreYtelser.kravOmAnnenStonad.svar")}
                hjelpetekst={t("dinSituasjon.andreYtelser.kravOmAnnenStonad.hvorfor")}
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
                hjelpetekst={t("dinSituasjon.andreYtelser.mottarPensjonUtland.hvorfor")}
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
