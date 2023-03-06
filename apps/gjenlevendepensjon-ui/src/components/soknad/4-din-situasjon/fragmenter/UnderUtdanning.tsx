import { SkjemaGruppe } from "nav-frontend-skjema";
import { RHFInput } from "../../../felles/RHFInput";
import Datovelger from "../../../felles/Datovelger";
import { useTranslation } from "react-i18next";
import SkjemaGruppering from "../../../felles/SkjemaGruppering";
import { Heading, Panel } from "@navikt/ds-react";
import { useBrukerContext } from "../../../../context/bruker/BrukerContext";
import { RHFCheckboksPanel } from "../../../felles/RHFCheckboksPanelGruppe";
import { IValg } from "../../../../typer/Spoersmaal";
import {SkjemaGruppeRad} from "../../../felles/StyledComponents";

const UnderUtdanning = () => {
    const { t } = useTranslation();
    const { state } = useBrukerContext();

    return (
        <SkjemaGruppering>

            <SkjemaGruppe>
                <Heading size={"small"}>{t("dinSituasjon.utdanning.tittel")}</Heading>
            </SkjemaGruppe>

            <Panel border>
                <RHFInput
                    name={"utdanning.naavaerendeUtdanning.navn"}
                    label={t("dinSituasjon.utdanning.naavaerendeUtdanning.navn")}
                    placeholder={t("dinSituasjon.utdanning.naavaerendeUtdanning.navnPlaceholder")}
                />

                <SkjemaGruppeRad>
                    <Datovelger
                        name={"utdanning.naavaerendeUtdanning.startDato"}
                        label={t("dinSituasjon.utdanning.naavaerendeUtdanning.startDato")}
                        minDate={state.foedselsdato}
                        maxDate={new Date()}
                    />

                    <Datovelger
                        name={"utdanning.naavaerendeUtdanning.sluttDato"}
                        label={t("dinSituasjon.utdanning.naavaerendeUtdanning.sluttDato")}
                        minDate={new Date()}
                    />
                </SkjemaGruppeRad>
            </Panel>


            <SkjemaGruppe>
                <br />
                <RHFCheckboksPanel
                    name={"utdanning.soeknadOmSkolepenger"}
                    legend={t("dinSituasjon.utdanning.soeknadOmSkolepenger")}
                    description={t("dinSituasjon.utdanning.soeknadOmSkolepenger.beskrivelse")}
                    valgfri={true}
                    checkbox={
                        {
                            label: t("dinSituasjon.utdanning.soeknadOmSkolepenger.bekreftelse"),
                            value: IValg.JA
                        }
                    }
                />
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFCheckboksPanel
                    name={"utdanning.soeknadOmTilleggsstoenadUtdanning"}
                    legend={t("dinSituasjon.utdanning.soeknadOmTilleggsstoenadUtdanning")}
                    description={t("dinSituasjon.utdanning.soeknadOmTilleggsstoenadUtdanning.beskrivelse")}
                    valgfri={true}
                    checkbox={
                        {
                            label: t("dinSituasjon.utdanning.soeknadOmTilleggsstoenadUtdanning.bekreftelse"),
                            value: IValg.JA
                        }
                    }
                />
            </SkjemaGruppe>
        </SkjemaGruppering>
    );
};

export default UnderUtdanning;
