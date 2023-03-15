import { SkjemaGruppe } from "../../../felles/SkjemaGruppe";
import { RHFInput } from "../../../felles/rhf/RHFInput";
import Datovelger from "../../../felles/Datovelger";
import { useTranslation } from "react-i18next";
import { Heading, Panel } from "@navikt/ds-react";
import { useBrukerContext } from "../../../../context/bruker/BrukerContext";
import {RHFCheckboksGruppe} from "../../../felles/rhf/RHFCheckboksPanelGruppe";
import { IValg } from "../../../../typer/Spoersmaal";
import {SkjemaGruppeRad} from "../../../felles/StyledComponents";
import {SkjemaElement} from "../../../felles/SkjemaElement";
import { addYears } from 'date-fns'

const UnderUtdanning = () => {
    const { t } = useTranslation();
    const { state } = useBrukerContext();

    return (
        <SkjemaGruppe>

            <SkjemaElement>
                <Heading size={"small"}>{t("dinSituasjon.utdanning.tittel")}</Heading>
            </SkjemaElement>

            <Panel border>
                <RHFInput
                    name={"utdanning.naavaerendeUtdanning.navn"}
                    label={t("dinSituasjon.utdanning.naavaerendeUtdanning.navn")}
                    placeholder={t("dinSituasjon.utdanning.naavaerendeUtdanning.navnPlaceholder")}
                />
                <SkjemaElement>
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
                            maxDate={addYears(new Date(), 10)}
                        />
                    </SkjemaGruppeRad>
                </SkjemaElement>
            </Panel>


            <SkjemaElement>
                <br />
                <RHFCheckboksGruppe
                    name={"utdanning.soeknadOmSkolepenger"}
                    legend={t("dinSituasjon.utdanning.soeknadOmSkolepenger")}
                    description={t("dinSituasjon.utdanning.soeknadOmSkolepenger.beskrivelse")}
                    required={false}
                    checkboxes={
                        [{
                            children: t("dinSituasjon.utdanning.soeknadOmSkolepenger.bekreftelse"),
                            value: IValg.JA
                        }]
                    }
                />
            </SkjemaElement>

            <SkjemaElement>
                <RHFCheckboksGruppe
                    name={"utdanning.soeknadOmTilleggsstoenadUtdanning"}
                    legend={t("dinSituasjon.utdanning.soeknadOmTilleggsstoenadUtdanning")}
                    description={t("dinSituasjon.utdanning.soeknadOmTilleggsstoenadUtdanning.beskrivelse")}
                    required={false}
                    checkboxes={
                        [{
                            children: t("dinSituasjon.utdanning.soeknadOmTilleggsstoenadUtdanning.bekreftelse"),
                            value: IValg.JA
                        }]
                    }
                />
            </SkjemaElement>
        </SkjemaGruppe>
    );
};

export default UnderUtdanning;
