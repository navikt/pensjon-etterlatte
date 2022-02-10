import { SkjemaGruppe } from "nav-frontend-skjema";
import { RHFCheckboksPanel } from "../../felles/RHFCheckboksPanelGruppe";
import { IValg } from "../../../typer/Spoersmaal";
import React from "react";
import { ISoeknad } from "../../../context/soknad/soknad";
import { useTranslation } from "react-i18next";
import { JobbStatus } from "../../../typer/situasjon";
import { IBarn } from "../../../typer/person";

const AndreYtelserVedBarn = ({ soeknad, barn }: { soeknad: ISoeknad, barn?: IBarn[] }) => {
    const { t } = useTranslation();

    const erArbeidstaker = soeknad.dinSituasjon.arbeidsforhold || soeknad.dinSituasjon.selvstendig; // todo: eller etablerer bedrift eller er syk.
    const erArbeidssoeker = soeknad.dinSituasjon.jobbStatus?.includes(JobbStatus.ingen); // todo: må være reell arbeidssøker
    const underUtdanning = soeknad.dinSituasjon.utdanning?.naavaerendeUtdanning;
    const harBarn = barn && barn.length > 0 || false;

    const rettTilBarnetilsyn = harBarn && erArbeidstaker;
    const rettTilUtdanningStoenad = underUtdanning;
    const rettTilBarnStoenad = harBarn && (underUtdanning || erArbeidssoeker);

    return (
        <>
            { rettTilBarnetilsyn &&
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

            {rettTilUtdanningStoenad &&
            <SkjemaGruppe>
                <RHFCheckboksPanel
                    name={"soeknadOmTilleggsstoenadUtdanning"}
                    legend={t("omBarn.soeknadOmTilleggsstoenadUtdanning")}
                    description={t("omBarn.soeknadOmTilleggsstoenadUtdanning.beskrivelse")}
                    valgfri={true}
                    checkbox={
                        {
                            label: t("omBarn.soeknadOmTilleggsstoenadUtdanning.bekreftelse"),
                            value: IValg.JA
                        }
                    }
                />
            </SkjemaGruppe>
            }
        </>
    );
};

export default AndreYtelserVedBarn;
