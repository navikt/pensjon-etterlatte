import { SkjemaGruppe } from "nav-frontend-skjema";
import Veileder from "nav-frontend-veileder";
import ikon from "../assets/ikoner/veileder_3.svg";
import { Alert, BodyLong, Button, Link } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";
import { Spraakvalg } from "./felles/Spraakvalg";
import { useLanguage } from "../hooks/useLanguage";


export default function SystemUtilgjengelig() {
    useLanguage();

    const { t } = useTranslation()

    const omstart = () => {
        window.location.href = "/gjenlevendepensjon/soknad"
    };

    return (
        <>
            <SkjemaGruppe>
                <Veileder tekst={t('systemUtilgjengelig.veileder')} posisjon="høyre">
                    <img alt="veileder" src={ikon} />
                </Veileder>
            </SkjemaGruppe>

            <Spraakvalg />

            <SkjemaGruppe>
                <Alert variant={"error"}>
                    <BodyLong>
                        {t('systemUtilgjengelig.intro')}
                    </BodyLong>
                </Alert>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <BodyLong>
                    {t('systemUtilgjengelig.beskrivelse')}
                </BodyLong>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <BodyLong>
                    {t('systemUtilgjengelig.tilbakemelding')}
                </BodyLong>

                <Link href={t('systemUtilgjengelig.tilbakemeldingLenke')}>
                    {t('systemUtilgjengelig.tilbakemeldingLenke')}
                </Link>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <BodyLong>
                    {t('systemUtilgjengelig.merOmYtelsene')}
                </BodyLong>

                <Link href={t('systemUtilgjengelig.merOmYtelseneLenke')}>
                    {t('systemUtilgjengelig.merOmYtelseneLenke')}
                </Link>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <section className={"navigasjon-rad"}>
                    <Button variant={"primary"} onClick={omstart}>
                        {t('systemUtilgjengelig.knappProevIgjen')}
                    </Button>
                </section>
            </SkjemaGruppe>
        </>
    );
}