import { Veileder } from '../felles/Veileder'
import React, { useEffect } from "react";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { Alert, BodyLong, BodyShort, Button, Link, Heading } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../hooks/useLanguage";
import {ForsideWrapper, NavigasjonsRadSection} from "../felles/StyledComponents";

const SoknadKvittering = () => {
    const { t } = useTranslation();
    useLanguage();

    useEffect(() => {
        window.history.pushState(null, document.title, window.location.href)
        window.addEventListener('popstate', () => {
            window.history.pushState(null, document.title, window.location.href);
        })
    }, [])

    return (
        <ForsideWrapper>
            <SkjemaGruppe className={"center"}>
                <Veileder></Veileder>
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
                           <Link href={t("soeknadKvittering.andreStoenader.stoenadListe.skolepenger.href")}>
                               {t("soeknadKvittering.andreStoenader.stoenadListe.skolepenger.tekst")}
                           </Link>
                        </BodyShort>
                    </li>
                    <li>
                        <BodyShort>
                            <Link href={t("soeknadKvittering.andreStoenader.stoenadListe.barnetilsyn.href")}>
                                {t("soeknadKvittering.andreStoenader.stoenadListe.barnetilsyn.tekst")}
                            </Link>
                        </BodyShort>
                    </li>
                    <li>
                        <BodyShort>
                            <Link href={t("soeknadKvittering.andreStoenader.stoenadListe.barnetrygd.href")}>
                                {t("soeknadKvittering.andreStoenader.stoenadListe.barnetrygd.tekst")}
                            </Link>
                        </BodyShort>
                    </li>
                </ul>

                <br/>

                <BodyLong spacing={true}>
                    {t("soeknadKvittering.andreStoenader.andreInformasjon")}
                </BodyLong>

                <BodyShort>
                    <Link href={t("soeknadKvittering.andreStoenader.stoenadListe.tillegg.href")}>
                        {t("soeknadKvittering.andreStoenader.stoenadListe.tillegg.tekst")}
                    </Link>
                </BodyShort>

                <br/>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <NavigasjonsRadSection>
                    <Button
                        variant={"primary"}
                        type={"button"}
                        onClick={() => (window.location.href = "https://www.nav.no")}
                    >
                        {t("soeknadKvittering.spoersmaal.knapp")}
                    </Button>
                </NavigasjonsRadSection>
            </SkjemaGruppe>
        </ForsideWrapper>
    );
};

export default SoknadKvittering;
