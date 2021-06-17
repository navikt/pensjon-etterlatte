import "./SoknadForside.less";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBrukerContext } from "../../context/bruker/BrukerContext";
import { useSoknadContext } from "../../context/soknad/SoknadContext";
import { ActionTypes } from "../../context/soknad/soknad";
import { useStegContext } from "../../context/steg/StegContext";
import { BekreftCheckboksPanel, SkjemaGruppe } from "nav-frontend-skjema";
import { Normaltekst, Sidetittel, Undertittel } from "nav-frontend-typografi";
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
                <Veileder tekst={`${t("forside.hei")}, ${innloggetBrukerNavn}`} posisjon="høyre">
                    <img alt="veileder" src={ikon}/>
                </Veileder>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Sidetittel>{t("forside.tittel")}</Sidetittel>

                <Normaltekst>{t("forside.omYtelsene")}</Normaltekst>

                <Normaltekst>
                    <Lenke href={"#"}>{t("forside.lenkeTilInfoOmYtelsene")}</Lenke>
                </Normaltekst>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Undertittel>{t("forside.riktigeOpplysninger.tittel")}</Undertittel>

                <Normaltekst>{t("forside.riktigeOpplysninger.intro")}</Normaltekst>

                <Normaltekst>{t("forside.riktigeOpplysninger.endringerMaaMeldesIfra")}</Normaltekst>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Undertittel>{t("forside.dokumentasjon.tittel")}</Undertittel>

                <Normaltekst>{t("forside.dokumentasjon.duFaarBeskjed")}</Normaltekst>

                <Normaltekst>{t("forside.dokumentasjon.duFaarBeskjed2")}</Normaltekst>

                <Normaltekst>
                    <Lenke href={"#"}>{t("forside.dokumentasjon.lenkeTilInformasjon")}</Lenke>
                </Normaltekst>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Undertittel>{t("forside.slikSoekerDu.tittel")}</Undertittel>

                <Normaltekst>{t("forside.slikSoekerDu.kunRelevantInfo")}</Normaltekst>

                <Normaltekst>{t("forside.slikSoekerDu.viLagrer")}</Normaltekst>

                <Normaltekst>{t("forside.slikSoekerDu.dokumentasjonKanEttersendes")}</Normaltekst>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Undertittel>{t("forside.samtykke.tittel")}</Undertittel>

                <br/>

                <BekreftCheckboksPanel
                    label={t("forside.samtykke.bekreftelse")}
                    checked={soknadState.harSamtykket}
                    onChange={(e) =>
                        soknadDispatch({
                            type: ActionTypes.OPPDATER_SAMTYKKE,
                            payload: (e.target as HTMLInputElement).checked
                        })
                    }
                >
                    <p>{t("forside.samtykke.beskrivelse")}</p>

                    <Lenke href="#">{t("forside.samtykke.lesMer")}</Lenke>
                </BekreftCheckboksPanel>
            </SkjemaGruppe>

            {soknadState.harSamtykket && (
                <Hovedknapp onClick={startSoeknad}>{t("forside.startSoeknad")}</Hovedknapp>
            )}
        </div>
    );
};

export default SoknadForside;
