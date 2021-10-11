import "./SoknadForside.scss";
import Veileder from "nav-frontend-veileder";
import ikon from "../../assets/ikoner/veileder.svg";
import { useSoknadContext } from "../../context/soknad/SoknadContext";
import { ActionTypes } from "../../context/soknad/soknad";
import React, { useEffect } from "react";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { Alert, BodyLong, BodyShort, Button, Link, Heading } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../hooks/useLanguage";
const SoknadKvittering = () => {
    const { t } = useTranslation();
    useLanguage();
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
                <Heading size={"medium"} spacing={true}>{t("soeknadKvittering.tittel")}</Heading>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Alert variant={"info"}>
                    {t("soeknadKvittering.kontakt")}
                </Alert>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Heading size={"medium"}>{t("soeknadKvittering.endring.tittel")}</Heading>

                <BodyLong>
                    {t("soeknadKvittering.endring.informasjon")}
                </BodyLong>

                <ul>
                    <li>
                        <BodyShort>
                            {t("soeknadKvittering.endring.endringsListe.sivilstatus")}
                        </BodyShort>
                    </li>
                    <li>
                        <BodyShort>
                            {t("soeknadKvittering.endring.endringsListe.inntekt")}
                        </BodyShort>
                    </li>
                    <li>
                        <BodyShort>
                            {t("soeknadKvittering.endring.endringsListe.bosted")}
                        </BodyShort>
                    </li>
                </ul>

                <BodyLong>
                    {t("soeknadKvittering.endring.rettigheter.informasjon")}&nbsp;
                    <Link href={t("soeknadKvittering.endring.rettigheter.lenke.href")}>{t("soeknadKvittering.endring.rettigheter.lenke.tekst")}</Link>
                </BodyLong>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Heading size={"medium"}>{t("soeknadKvittering.seSaken.tittel")}</Heading>

                {/* TODO: Sett inn riktig lenke for Dine saker */}
                <BodyLong>
                    {t("soeknadKvittering.seSaken.informasjon.innhold1")}&nbsp;
                    <Link href={t("soeknadKvittering.seSaken.informasjon.lenkeDittNAV.href")}>{t("soeknadKvittering.seSaken.informasjon.lenkeDittNAV.tekst")}</Link>&nbsp;
                    {t("soeknadKvittering.seSaken.informasjon.innhold2")}&nbsp;
                    <Link href={t("soeknadKvittering.seSaken.informasjon.lenkeDineSaker.href")}>{t("soeknadKvittering.seSaken.informasjon.lenkeDineSaker.tekst")}</Link>&nbsp;
                    {t("soeknadKvittering.seSaken.informasjon.innhold3")}&nbsp;
                </BodyLong>
                    <br/>
                <BodyLong>
                    <Link href={t("soeknadKvittering.seSaken.behandlingstidInfo.lenke.href")}>{t("soeknadKvittering.seSaken.behandlingstidInfo.lenke.tekst")}</Link>
                </BodyLong>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Heading size={"medium"}>
                    {t("soeknadKvittering.andreStoenader.tittel")}
                </Heading>

                <BodyLong>
                    {t("soeknadKvittering.andreStoenader.informasjon")}
                </BodyLong>

                <ul>
                    <li>
                        <BodyShort>
                            {t("soeknadKvittering.andreStoenader.stoenadListe.barnetrygd")}
                        </BodyShort>
                    </li>
                    <li>
                        <BodyShort>
                            {t("soeknadKvittering.andreStoenader.stoenadListe.barnetilsyn")}
                        </BodyShort>
                    </li>
                    <li>
                        <BodyShort>
                            {t("soeknadKvittering.andreStoenader.stoenadListe.tilsyn")}
                        </BodyShort>
                    </li>
                    <li>
                        <BodyShort>
                            {t("soeknadKvittering.andreStoenader.stoenadListe.tillegg")}
                        </BodyShort>
                    </li>
                    <li>
                        <BodyShort>
                            {t("soeknadKvittering.andreStoenader.stoenadListe.skolepenger")}
                        </BodyShort>
                    </li>
                </ul>

                <br/>

                <BodyLong>
                    <Link href={t("soeknadKvittering.andreStoenader.lenke.href")}>
                        {t("soeknadKvittering.andreStoenader.lenke.tekst")}
                    </Link>
                </BodyLong>
                <br/>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <section className={"navigasjon-rad"}>
                    <Button
                        variant={"primary"}
                        type={"button"}
                        onClick={() => (window.location.href = "https://www.nav.no")}
                    >
                        {t("soeknadKvittering.spoersmaal.knapp")}
                    </Button>
                </section>
            </SkjemaGruppe>
        </div>
    );
};

export default SoknadKvittering;
