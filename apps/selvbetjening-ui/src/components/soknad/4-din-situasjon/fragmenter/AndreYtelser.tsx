import { SkjemaGruppe } from "nav-frontend-skjema";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { RHFSpoersmaalRadio } from "../../../felles/RHFRadio";
import { RHFInput } from "../../../felles/RHFInput";
import { IValg } from "../../../../typer/Spoersmaal";
import { ISituasjon } from "../../../../typer/situasjon";
import HvorforSpoerVi from "../../../felles/HvorforSpoerVi";
import { BodyLong, Title } from "@navikt/ds-react";
import SkjemaGruppering from "../../../felles/SkjemaGruppering";

const AndreYtelser = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISituasjon>();

    const kravOmAnnenStonad = watch("andreYtelser.kravOmAnnenStonad.svar");
    const mottarPensjonUtland = watch("andreYtelser.mottarPensjonUtland.svar");

    return (
        <>
            <SkjemaGruppering>
                {/* Steg 7 */}
                <SkjemaGruppe>
                    <Title size={"s"}>{t("dinSituasjon.andreYtelser.tittel")}</Title>
                    <BodyLong>{t("dinSituasjon.andreYtelser.ingress")}</BodyLong>
                </SkjemaGruppe>

                <RHFSpoersmaalRadio
                    name={"andreYtelser.kravOmAnnenStonad.svar"}
                    legend={t("dinSituasjon.andreYtelser.kravOmAnnenStonad.svar")}
                />

                {kravOmAnnenStonad === IValg.JA && (
                    <RHFInput
                        bredde={"XXL"}
                        name={"andreYtelser.kravOmAnnenStonad.beskrivelse"}
                        label={t("dinSituasjon.andreYtelser.kravOmAnnenStonad.beskrivelse")}
                    />
                )}
            </SkjemaGruppering>

            <SkjemaGruppering>
                <RHFSpoersmaalRadio
                    name={"andreYtelser.mottarPensjonUtland.svar"}
                    legend={t("dinSituasjon.andreYtelser.mottarPensjonUtland.svar")}
                    description={
                        <HvorforSpoerVi>{t("dinSituasjon.andreYtelser.mottarPensjonUtland.hvorfor")}</HvorforSpoerVi>
                    }
                />

                {mottarPensjonUtland === IValg.JA && (
                    <>
                        <RHFInput
                            bredde={"XXL"}
                            name={"andreYtelser.mottarPensjonUtland.hvaSlagsPensjon"}
                            label={t("dinSituasjon.andreYtelser.mottarPensjonUtland.hvaSlagsPensjon")}
                        />

                        <RHFInput
                            bredde={"L"}
                            name={"andreYtelser.mottarPensjonUtland.fraHvilketLand"}
                            label={t("dinSituasjon.andreYtelser.mottarPensjonUtland.fraHvilketLand")}
                        />

                        <RHFInput
                            bredde={"L"}
                            name={"andreYtelser.mottarPensjonUtland.bruttobeloepPrAar"}
                            label={t("dinSituasjon.andreYtelser.mottarPensjonUtland.bruttobeloepPrAar")}
                        />

                    </>
                )}
            </SkjemaGruppering>
        </>
    );

};

export default AndreYtelser;
