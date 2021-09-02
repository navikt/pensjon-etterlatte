import "./SoknadForside.scss";
import Veileder from "nav-frontend-veileder";
import ikon from "../../assets/ikoner/veileder.svg";
import { useSoknadContext } from "../../context/soknad/SoknadContext";
import { ActionTypes } from "../../context/soknad/soknad";
import React, { useEffect } from "react";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { Alert, BodyLong, BodyShort, Button, Link, Title } from "@navikt/ds-react";
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
                <Title size={"m"}>{t("soeknadKvittering.tittel")}</Title>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Alert variant={"success"}>
                    {t("soeknadKvittering.alertMottattSoeknad")}
                </Alert>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <BodyLong>
                    {t("soeknadKvittering.informasjon.kontakt")}
                </BodyLong>

                <BodyLong>
                    {t("soeknadKvittering.informasjon.endring")}
                </BodyLong>

                <ul>
                    <li>
                        <BodyShort>
                            {t("soeknadKvittering.informasjon.endringsListe.sivilstatus")}
                        </BodyShort>
                    </li>
                    <li>
                        <BodyShort>
                            {t("soeknadKvittering.informasjon.endringsListe.inntekt")}
                        </BodyShort>
                    </li>
                    <li>
                        <BodyShort>
                            {t("soeknadKvittering.informasjon.endringsListe.bosted")}
                        </BodyShort>
                    </li>
                </ul>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Title size={"m"}>{t("soeknadKvittering.seSaken.tittel")}</Title>

                <BodyLong>
                    {t("soeknadKvittering.seSaken.informasjon.innhold1")}&nbsp;
                    <Link href={t("soeknadKvittering.seSaken.informasjon.lenkeDittNAV.href")}>{t("soeknadKvittering.seSaken.informasjon.lenkeDittNAV.tekst")}</Link>&nbsp;
                    {t("soeknadKvittering.seSaken.informasjon.innhold2")}&nbsp;
                    <Link href={t("soeknadKvittering.seSaken.informasjon.lenkeDineSaker.href")}>{t("soeknadKvittering.seSaken.informasjon.lenkeDineSaker.tekst")}</Link>.
                </BodyLong>

                {/* TODO: Støtte print / nedlastning ? */}
                <BodyLong>
                    <Link href={t("soeknadKvittering.seSaken.lenkeNedlastning.href")}>{t("soeknadKvittering.seSaken.lenkeNedlastning.tekst")}</Link>
                    <br/>
                    <Link href={t("soeknadKvittering.seSaken.lenkeSkrivUt.href")}>{t("soeknadKvittering.seSaken.lenkeSkrivUt.tekst")}</Link>
                </BodyLong>

                {/* TODO: Fikse estimert tid for behandling */}
                <BodyLong>
                    {t("soeknadKvittering.seSaken.behandlingstidInfo.innhold")}&nbsp;
                    <Link href={t("soeknadKvittering.seSaken.behandlingstidInfo.lenke.href")}>{t("soeknadKvittering.seSaken.behandlingstidInfo.lenke.tekst")}</Link>.
                </BodyLong>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Title size={"m"}>
                    {t("soeknadKvittering.andreStoenader.tittel")}
                </Title>

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

                <Button
                    variant={"primary"}
                    onClick={() => {}}
                >
                    {t("soeknadKvittering.andreStoenader.knapp")}
                </Button>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Title size={"m"}>
                    {t("soeknadKvittering.spoersmaal.tittel")}
                </Title>

                <BodyLong>
                    {t("soeknadKvittering.spoersmaal.informasjon")}
                </BodyLong>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <section className={"navigasjon-rad"}>
                    <Button
                        variant={"action"}
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
