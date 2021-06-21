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
                <Veileder tekst={`${t("forside.hei", { navn: innloggetBrukerNavn })}`} posisjon="høyre">
                    <img alt="veileder" src={ikon}/>
                </Veileder>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Sidetittel>{t("forside.tittel")}</Sidetittel>

                <Normaltekst>{t("forside.omYtelsene.innhold")}</Normaltekst>

                <Normaltekst>
                    <Lenke href={"https://www.nav.no/no/person/familie/har-du-mistet-noen-i-naer-familie/har-du-mistet-ektefellen-samboeren-eller-partneren-din"}>
                        {t("forside.omYtelsene.lenke")}
                    </Lenke>
                </Normaltekst>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Undertittel>{t("forside.barnepensjon.tittel")}</Undertittel>

                <Normaltekst>{t("forside.barnepensjon.innhold")}</Normaltekst>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Undertittel>{t("forside.riktigeOpplysninger.tittel")}</Undertittel>

                <Normaltekst>{t("forside.riktigeOpplysninger.innhold")}</Normaltekst>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Undertittel>{t("forside.uthentingAvInfo.tittel")}</Undertittel>

                <Normaltekst>{t("forside.uthentingAvInfo.innhold")}</Normaltekst>

                <Normaltekst>
                    <Lenke href={"https://www.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten/personvernerklaering-for-arbeids-og-velferdsetaten"}>
                        {t("forside.uthentingAvInfo.lenke")}
                    </Lenke>
                </Normaltekst>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Undertittel>{t("forside.slikSoekerDu.tittel")}</Undertittel>

                <Normaltekst>{t("forside.slikSoekerDu.innhold")}</Normaltekst>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Undertittel>{t("forside.samtykke.tittel")}</Undertittel>

                <br/>

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
                    <Normaltekst>{t("forside.samtykke.innhold")}</Normaltekst>

                    <Normaltekst>
                        {t("forside.samtykke.harLest")}:&nbsp;
                        <Lenke href={"https://www.nav.no/rettogplikt"}>nav.no/rettogplikt</Lenke>
                    </Normaltekst>
                </BekreftCheckboksPanel>
            </SkjemaGruppe>

            {soknadState.harSamtykket && (
                <Hovedknapp onClick={startSoeknad}>{t("forside.startSoeknad")}</Hovedknapp>
            )}
        </div>
    );
};

export default SoknadForside;
