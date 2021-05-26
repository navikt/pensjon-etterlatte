import { useTranslation } from "react-i18next";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { ISoeker } from "../../../../typer/person";
import { Undertittel } from "nav-frontend-typografi";
import Panel from "nav-frontend-paneler";
import { useFormContext } from "react-hook-form";
import RHFInput from "../../../felles/RHFInput";
import { RHFToValgRadio } from "../../../felles/RHFRadio";
import IValg from "../../../../typer/IValg";

const SamboerSkjema = () => {
    const { t } = useTranslation();

    const { watch } = useFormContext<ISoeker>();

    const samboerHarInntekt = watch("samboer.harInntekt")

    return (
        <Panel border>
            <Undertittel>Opplysninger om samboer</Undertittel>

            <br />

            {/* 2.16 */}
            <RHFInput
                name={"samboer.navn"}
                label={t("omSoekeren.oppgiNavnSamboer")}
            />

            <RHFInput
                name={"samboer.foedselsnummer"}
                label={t("felles.fnr")}
            />

            <RHFToValgRadio
                name={"samboer.hattBarnEllerVaertGift"}
                legend={t("omSoekeren.harHattBarnEllerVaertGiftMedSamboer")}
            />

            {/* 2.17 */}
            <RHFToValgRadio
                name={"samboer.harInntekt"}
                legend={t("omSoekeren.harSamboerInntekt.tittel")}
            />

            {samboerHarInntekt === IValg.JA && (
                <>
                    <SkjemaGruppe className={"inputPanelGruppe"}>
                        {/* TODO: Fikse ifm RHF */}
                        {/*<Sjekkboks navn={""} label={t("omSoekeren.harSamboerInntekt.arbeidsinntekt")} />*/}
                        {/*<Sjekkboks navn={""} label={t("omSoekeren.harSamboerInntekt.pensjon")} />*/}
                        {/*<Sjekkboks navn={""} label={t("omSoekeren.harSamboerInntekt.kapitalinntekt")} />*/}
                        {/*<Sjekkboks navn={""} label={t("omSoekeren.harSamboerInntekt.andreYtelser")} />*/}
                    </SkjemaGruppe>

                    <RHFInput
                        name={"samboer.samletBruttoinntektPrAar"}
                        label={t("omSoekeren.harSamboerInntekt.bruttoinntekt")}
                    />
                </>
            )}
        </Panel>
    );
};

export default SamboerSkjema;
