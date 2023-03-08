import { SkjemaGruppe } from "../../../felles/SkjemaGruppe";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { RHFSpoersmaalRadio } from "../../../felles/RHFRadio";
import { RHFInput } from "../../../felles/RHFInput";
import { IValg } from "../../../../typer/Spoersmaal";
import { ISituasjon } from "../../../../typer/situasjon";
import HvorforSpoerVi from "../../../felles/HvorforSpoerVi";
import { BodyLong, Heading } from "@navikt/ds-react";
import { RHFSelect } from "../../../felles/RHFSelect";
import { useLand } from "../../../../hooks/useLand";
import SelectYtelser from "./SelectYtelser";
import {SkjemaElement} from "../../../felles/SkjemaElement";
import {Bredde} from "../../../../typer/bredde";


const AndreYtelser = () => {
    const { t } = useTranslation();
    const { land }: any = useLand();
    const { watch } = useFormContext<ISituasjon>();

    const kravOmAnnenStonad = watch("andreYtelser.kravOmAnnenStonad.svar");
    const annenPensjon = watch("andreYtelser.annenPensjon.svar");
    const mottarPensjonUtland = watch("andreYtelser.mottarPensjonUtland.svar");

    return (
        <>
            <SkjemaGruppe>
                <SkjemaGruppe>
                    <Heading size={"small"}>{t("dinSituasjon.andreYtelser.tittel")}</Heading>
                    <BodyLong>{t("dinSituasjon.andreYtelser.ingress")}</BodyLong>
                </SkjemaGruppe>

                <RHFSpoersmaalRadio
                    name={"andreYtelser.kravOmAnnenStonad.svar"}
                    legend={t("dinSituasjon.andreYtelser.kravOmAnnenStonad.svar")}
                />

                {kravOmAnnenStonad === IValg.JA && (
                    <SelectYtelser/>
                )}
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFSpoersmaalRadio
                    name={"andreYtelser.annenPensjon.svar"}
                    legend={t("dinSituasjon.andreYtelser.annenPensjon.svar")}
                />

                {annenPensjon === IValg.JA && (
                    <RHFInput
                        name={"andreYtelser.annenPensjon.beskrivelse"}
                        label={t("dinSituasjon.andreYtelser.annenPensjon.beskrivelse")}
                        placeholder={t("dinSituasjon.andreYtelser.annenPensjon.placeholder")}
                    />
                )}
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFSpoersmaalRadio
                    name={"andreYtelser.mottarPensjonUtland.svar"}
                    legend={t("dinSituasjon.andreYtelser.mottarPensjonUtland.svar")}
                    description={
                        <HvorforSpoerVi title="dinSituasjon.andreYtelser.mottarPensjonUtland.svar">{t("dinSituasjon.andreYtelser.mottarPensjonUtland.hvorfor")}</HvorforSpoerVi>
                    }
                />

                {mottarPensjonUtland === IValg.JA && (
                    <>
                        <SkjemaElement>
                            <RHFInput
                                name={"andreYtelser.mottarPensjonUtland.hvaSlagsPensjon"}
                                label={t("dinSituasjon.andreYtelser.mottarPensjonUtland.hvaSlagsPensjon")}
                                placeholder={t("dinSituasjon.andreYtelser.mottarPensjonUtland.hvaSlagsPensjonPlaceholder")}
                            />
                        </SkjemaElement>
                        <SkjemaElement>
                            <RHFSelect
                                className="kol-50"
                                name={`andreYtelser.mottarPensjonUtland.fraHvilketLand`}
                                label={t("dinSituasjon.andreYtelser.mottarPensjonUtland.fraHvilketLand")}
                                selectOptions={land}
                            />
                        </SkjemaElement>
                        <SkjemaElement>
                            <RHFInput
                                htmlSize={Bredde.S}
                                name={"andreYtelser.mottarPensjonUtland.bruttobeloepPrAar"}
                                label={t("dinSituasjon.andreYtelser.mottarPensjonUtland.bruttobeloepPrAar")}
                            />
                        </SkjemaElement>
                    </>
                )}
            </SkjemaGruppe>
        </>
    );

};

export default AndreYtelser;
