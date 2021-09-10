import "./SoknadForside.scss";
import { useHistory } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { useBrukerContext } from "../../context/bruker/BrukerContext";
import { useSoknadContext } from "../../context/soknad/SoknadContext";
import { ActionTypes } from "../../context/soknad/soknad";
import { useStegContext } from "../../context/steg/StegContext";
import { BekreftCheckboksPanel, SkjemaGruppe } from "nav-frontend-skjema";
import Veileder from "nav-frontend-veileder";
import ikon from "../../assets/ikoner/veileder.svg";
import { BodyLong, Button, Link, Title } from "@navikt/ds-react";
import { logEvent, LogEvents } from "../../utils/amplitude";

const SoknadForside = () => {
    const history = useHistory();

    const { t } = useTranslation();

    const { state: soknadState, dispatch: soknadDispatch } = useSoknadContext();

    const { state: brukerState } = useBrukerContext();

    const {
        state: { steg },
    } = useStegContext();

    const startSoeknad = () => {
        const foersteSteg = steg[0];
        logEvent(LogEvents.AAPNE_SOKNAD);
        history.push(`/soknad/steg/${foersteSteg.path}`);
    };

    const innloggetBrukerNavn = `${brukerState?.fornavn} ${brukerState?.etternavn}`;

    const heiTekst = (
        <div className={!brukerState?.fornavn ? "blur-text" : ""}>
            {t("forside.hei", { navn: innloggetBrukerNavn })}
        </div>
    );

    return (
        <div className={"forside"}>
            <SkjemaGruppe>
                <Veileder tekst={heiTekst} posisjon="høyre">
                    <img alt="veileder" src={ikon} />
                </Veileder>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Title spacing size={"l"}>
                    {t("forside.tittel")}
                </Title>

                <BodyLong spacing>{t("forside.omYtelsene.innhold")}</BodyLong>

                <BodyLong>
                    <Link href={t("forside.omYtelsene.lenke.href")}>{t("forside.omYtelsene.lenke.tekst")}</Link>
                </BodyLong>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Title size={"s"}>{t("forside.barnepensjon.tittel")}</Title>

                <BodyLong>{t("forside.barnepensjon.innhold")}</BodyLong>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Title size={"s"}>{t("forside.uthentingAvInfo.tittel")}</Title>

                <BodyLong>
                    <Trans i18nKey={"forside.uthentingAvInfo.innhold"} />
                </BodyLong>

                <ul>
                    <li>
                        <BodyLong>
                            <Trans i18nKey={"forside.uthentingAvInfo.innholdListe.li1"} />
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong>
                            <Trans i18nKey={"forside.uthentingAvInfo.innholdListe.li2"} />
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong>
                            <Trans i18nKey={"forside.uthentingAvInfo.innholdListe.li3"} />
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong>
                            <Trans i18nKey={"forside.uthentingAvInfo.innholdListe.li4"} />
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong>
                            <Trans i18nKey={"forside.uthentingAvInfo.innholdListe.li5"} />
                        </BodyLong>
                    </li>
                </ul>

                <BodyLong spacing>
                    <Link href={t("forside.uthentingAvInfo.lenke1.href")}>
                        {t("forside.uthentingAvInfo.lenke1.tekst")}
                    </Link>
                </BodyLong>

                <BodyLong>
                    <Link href={t("forside.uthentingAvInfo.lenke2.href")}>
                        {t("forside.uthentingAvInfo.lenke2.tekst")}
                    </Link>
                </BodyLong>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Title size={"s"}>{t("forside.samtykke.tittel")}</Title>

                <BodyLong>{t("forside.samtykke.innhold")}</BodyLong>

                <BekreftCheckboksPanel
                    label={t("forside.samtykke.bekreftelse", { navn: innloggetBrukerNavn })}
                    checked={soknadState.harSamtykket}
                    onChange={(e) =>
                        soknadDispatch({
                            type: ActionTypes.OPPDATER_SAMTYKKE,
                            payload: (e.target as HTMLInputElement).checked,
                        })
                    }
                />
            </SkjemaGruppe>

            {soknadState.harSamtykket && (
                <Button variant={"action"} type={"button"} onClick={startSoeknad}>
                    {t("forside.startSoeknad")}
                </Button>
            )}
        </div>
    );
};

export default SoknadForside;
