import "./SoknadForside.less";
import Lenke from "nav-frontend-lenker";
import { Normaltekst, Systemtittel } from "nav-frontend-typografi";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import Veileder from "nav-frontend-veileder";
import ikon from "../../assets/ikoner/veileder.svg";
import { useSoknadContext } from "../../context/soknad/SoknadContext";
import { ActionTypes } from "../../context/soknad/soknad";
import React, { useEffect } from "react";
import { SkjemaGruppe } from "nav-frontend-skjema";
import AlertStripe from "nav-frontend-alertstriper";
import { useTranslation } from "react-i18next";

const SoknadKvittering = () => {
    const { t } = useTranslation();

    const { dispatch } = useSoknadContext();

    useEffect(() => {
        dispatch({ type: ActionTypes.TILBAKESTILL });
    }, [dispatch])

    return (
        <div className={"forside"}>
            <SkjemaGruppe className={"center"}>
                <Veileder>
                    <img alt="veileder" src={ikon}/>
                </Veileder>
            </SkjemaGruppe>

            <SkjemaGruppe className={"center"}>
                <Systemtittel>{t("soeknadKvittering.tittel")}</Systemtittel>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <AlertStripe type={"suksess"}>
                    {t("soeknadKvittering.alertMottattSoeknad")}
                </AlertStripe>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Normaltekst>
                    {t("soeknadKvittering.informasjon.kontakt")}
                </Normaltekst>

                <Normaltekst>
                    {t("soeknadKvittering.informasjon.endring")}
                </Normaltekst>

                <Normaltekst>
                    <ul>
                        <li>
                            {t("soeknadKvittering.informasjon.endringsListe.sivilstatus")}
                        </li>
                        <li>
                            {t("soeknadKvittering.informasjon.endringsListe.inntekt")}
                        </li>
                        <li>
                            {t("soeknadKvittering.informasjon.endringsListe.bosted")}
                        </li>
                    </ul>
                </Normaltekst>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Systemtittel>{t("soeknadKvittering.seSaken.tittel")}</Systemtittel>

                <Normaltekst>
                    {t("soeknadKvittering.seSaken.informasjon.innhold1")}&nbsp;
                    <Lenke href={t("soeknadKvittering.seSaken.informasjon.lenkeDittNAV.href")}>{t("soeknadKvittering.seSaken.informasjon.lenkeDittNAV.tekst")}</Lenke>&nbsp;
                    {t("soeknadKvittering.seSaken.informasjon.innhold2")}&nbsp;
                    <Lenke href={t("soeknadKvittering.seSaken.informasjon.lenkeDineSaker.href")}>{t("soeknadKvittering.seSaken.informasjon.lenkeDineSaker.tekst")}</Lenke>.
                </Normaltekst>

                <Normaltekst>
                    <Lenke href={t("soeknadKvittering.seSaken.lenkeNedlastning.href")}>{t("soeknadKvittering.seSaken.lenkeNedlastning.tekst")}</Lenke>
                    <br/>
                    <Lenke href={t("soeknadKvittering.seSaken.lenkeSkrivUt.href")}>{t("soeknadKvittering.seSaken.lenkeSkrivUt.tekst")}</Lenke>
                </Normaltekst>

                <Normaltekst>
                    {t("soeknadKvittering.seSaken.behandlingstidInfo.innhold")}&nbsp;
                    <Lenke href={t("soeknadKvittering.seSaken.behandlingstidInfo.lenke.href")}>{t("soeknadKvittering.seSaken.behandlingstidInfo.lenke.tekst")}</Lenke>.
                </Normaltekst>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Systemtittel>
                    {t("soeknadKvittering.andreStoenader.tittel")}
                </Systemtittel>

                <Normaltekst>
                    {t("soeknadKvittering.andreStoenader.informasjon")}
                </Normaltekst>

                <Normaltekst>
                    <ul>
                        <li>{t("soeknadKvittering.andreStoenader.stoenadListe.barnetrygd")}</li>
                        <li>{t("soeknadKvittering.andreStoenader.stoenadListe.barnetilsyn")}</li>
                        <li>{t("soeknadKvittering.andreStoenader.stoenadListe.tilsyn")}</li>
                        <li>{t("soeknadKvittering.andreStoenader.stoenadListe.tillegg")}</li>
                        <li>{t("soeknadKvittering.andreStoenader.stoenadListe.skolepenger")}</li>
                    </ul>
                    <br/>
                    <Lenke href={t("soeknadKvittering.andreStoenader.lenke.href")}>
                        {t("soeknadKvittering.andreStoenader.lenke.tekst")}
                    </Lenke>
                </Normaltekst>
                <br/>
                <Knapp onClick={() => {
                }}>
                    {t("soeknadKvittering.andreStoenader.knapp")}
                </Knapp>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Systemtittel>
                    {t("soeknadKvittering.spoersmaal.tittel")}
                </Systemtittel>

                <Normaltekst>
                    {t("soeknadKvittering.spoersmaal.informasjon")}
                </Normaltekst>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <section className={"navigasjon-rad"}>
                    <Hovedknapp onClick={() => (window.location.href = "https://www.nav.no")}>{t("soeknadKvittering.spoersmaal.knapp")}</Hovedknapp>
                </section>
            </SkjemaGruppe>
        </div>
    );
};

export default SoknadKvittering;
