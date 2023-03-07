import { SkjemaGruppe } from "../../felles/SkjemaGruppe";
import { RHFCheckboksPanel } from "../../felles/RHFCheckboksPanelGruppe";
import { IValg } from "../../../typer/Spoersmaal";
import React from "react";
import { ISoeknad } from "../../../context/soknad/soknad";
import { useTranslation } from "react-i18next";
import { JobbStatus } from "../../../typer/situasjon";
import { IBarn } from "../../../typer/person";
import { IngenJobb } from "../../../typer/arbeidsforhold";

const AndreStoenader = ({ soeknad, barn }: { soeknad: ISoeknad, barn?: IBarn[] }) => {
    const { t } = useTranslation();
    const situasjon = soeknad.dinSituasjon;

    const erArbeidstaker = situasjon.arbeidsforhold || situasjon.selvstendig;
    const erArbeidssoeker = situasjon.jobbStatus?.includes(JobbStatus.arbeidssoeker);
    const etablererBedrift = situasjon.ingenJobbBeskrivelse === IngenJobb.etablererBedrift
    const erSyk = situasjon.ingenJobbBeskrivelse === IngenJobb.syk
    const underUtdanning = situasjon.utdanning?.naavaerendeUtdanning;
    const harBarn = barn && barn.length > 0 || false;

    const rettTilBarnetilsyn = harBarn && (erArbeidstaker || etablererBedrift || erSyk);
    const rettTilBarnStoenad = harBarn && (underUtdanning || erArbeidssoeker);

    return (
        <>
            {rettTilBarnetilsyn &&
            <SkjemaGruppe>
                <RHFCheckboksPanel
                    name={"soeknadOmBarnetilsyn"}
                    legend={t("omBarn.soeknadOmBarnetilsyn")}
                    description={t("omBarn.soeknadOmBarnetilsyn.beskrivelse")}
                    valgfri={true}
                    checkbox={
                        {
                            label: t("omBarn.soeknadOmBarnetilsyn.bekreftelse"),
                            value: IValg.JA
                        }
                    }
                />
            </SkjemaGruppe>
            }

            {rettTilBarnStoenad &&
            <SkjemaGruppe>
                <RHFCheckboksPanel
                    name={"soeknadOmTilleggsstoenadBarnepass"}
                    legend={t("omBarn.soeknadOmTilleggsstoenadBarnepass")}
                    description={t("omBarn.soeknadOmTilleggsstoenadBarnepass.beskrivelse")}
                    valgfri={true}
                    checkbox={
                        {
                            label: t("omBarn.soeknadOmTilleggsstoenadBarnepass.bekreftelse"),
                            value: IValg.JA
                        }
                    }
                />
            </SkjemaGruppe>
            }
        </>
    );
};

export default AndreStoenader;
