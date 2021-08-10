import "./SoknadForside.less";
import { useHistory } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { useBrukerContext } from "../../context/bruker/BrukerContext";
import { useSoknadContext } from "../../context/soknad/SoknadContext";
import { ActionTypes } from "../../context/soknad/soknad";
import { useStegContext } from "../../context/steg/StegContext";
import { BekreftCheckboksPanel, SkjemaGruppe } from "nav-frontend-skjema";
import { Innholdstittel, Normaltekst, Undertittel } from "nav-frontend-typografi";
import { Hovedknapp } from "nav-frontend-knapper";
import Veileder from "nav-frontend-veileder";
import Lenke from "nav-frontend-lenker";
import ikon from "../../assets/ikoner/veileder.svg";

const SoknadForside = () => {
    const history = useHistory();

    const { t } = useTranslation();

    const {
        state: soknadState,
        dispatch: soknadDispatch
    } = useSoknadContext();

    const { state: brukerState } = useBrukerContext();

    const { state: { steg } } = useStegContext();

    const startSoeknad = () => {
        const foersteSteg = steg[0]
        history.push(`/soknad/steg/${foersteSteg.path}`)
    }

    const innloggetBrukerNavn = `${brukerState?.fornavn} ${brukerState?.etternavn}`;

    return (
        <div className={"forside"}>
            <SkjemaGruppe>
                <Veileder tekst={`${t("forside.hei", { navn: innloggetBrukerNavn })}`} posisjon="høyre">
                    <img alt="veileder" src={ikon}/>
                </Veileder>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Innholdstittel>{t("forside.tittel")}</Innholdstittel>

                <Normaltekst>{t("forside.omYtelsene.innhold")}</Normaltekst>

                <Normaltekst>
                    <Lenke href={t("forside.omYtelsene.lenke.href")}>
                        {t("forside.omYtelsene.lenke.tekst")}
                    </Lenke>
                </Normaltekst>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Undertittel>{t("forside.barnepensjon.tittel")}</Undertittel>

                <Normaltekst>{t("forside.barnepensjon.innhold")}</Normaltekst>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Undertittel>{t("forside.uthentingAvInfo.tittel")}</Undertittel>

                <Normaltekst>
                    <Trans i18nKey={"forside.uthentingAvInfo.innhold"} />
                </Normaltekst>

                <ul>
                    <li>
                        <Normaltekst>
                            <Trans i18nKey={"forside.uthentingAvInfo.innholdListe.li1"} />
                        </Normaltekst>
                    </li>
                    <li>
                        <Normaltekst>
                            <Trans i18nKey={"forside.uthentingAvInfo.innholdListe.li2"} />
                        </Normaltekst>
                    </li>
                    <li>
                        <Normaltekst>
                            <Trans i18nKey={"forside.uthentingAvInfo.innholdListe.li3"} />
                        </Normaltekst>
                    </li>
                    <li>
                        <Normaltekst>
                            <Trans i18nKey={"forside.uthentingAvInfo.innholdListe.li4"} />
                        </Normaltekst>
                    </li>
                    <li>
                        <Normaltekst>
                            <Trans i18nKey={"forside.uthentingAvInfo.innholdListe.li5"} />
                        </Normaltekst>
                    </li>
                </ul>

                <Normaltekst>
                    <Lenke href={t("forside.uthentingAvInfo.lenke1.href")}>
                        {t("forside.uthentingAvInfo.lenke1.tekst")}
                    </Lenke>
                </Normaltekst>

                <Normaltekst>
                    <Lenke href={t("forside.uthentingAvInfo.lenke2.href")}>
                        {t("forside.uthentingAvInfo.lenke2.tekst")}
                    </Lenke>
                </Normaltekst>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Undertittel>{t("forside.samtykke.tittel")}</Undertittel>

                <Normaltekst>{t("forside.samtykke.innhold")}</Normaltekst>

                <BekreftCheckboksPanel
                    label={t("forside.samtykke.bekreftelse", { navn: innloggetBrukerNavn })}
                    checked={soknadState.harSamtykket}
                    onChange={(e) =>
                        soknadDispatch({
                            type: ActionTypes.OPPDATER_SAMTYKKE,
                            payload: (e.target as HTMLInputElement).checked
                        })
                    }
                >
                    {t("forside.samtykke.harLest")}&nbsp;
                    <Lenke href={t("forside.samtykke.lenke.href")}>
                        {t("forside.samtykke.lenke.tekst")}
                    </Lenke>
                </BekreftCheckboksPanel>
            </SkjemaGruppe>

            {soknadState.harSamtykket && (
                <Hovedknapp onClick={startSoeknad}>{t("forside.startSoeknad")}</Hovedknapp>
            )}
        </div>
    );
};

export default SoknadForside;
