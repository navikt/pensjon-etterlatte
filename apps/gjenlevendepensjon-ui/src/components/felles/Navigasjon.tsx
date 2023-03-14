import { SkjemaGruppe } from "./SkjemaGruppe";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSoknadContext } from "../../context/soknad/SoknadContext";
import { useBrukerContext } from "../../context/bruker/BrukerContext";
import { ActionTypes as BrukerAction } from "../../context/bruker/bruker";
import { ActionTypes as SoknadAction } from "../../context/soknad/soknad";
import { erDato } from "../../utils/dato";
import { BodyShort, Button, Heading, Loader, Modal } from "@navikt/ds-react";
import { LogEvents, useAmplitude } from "../../utils/amplitude";
import { slettSoeknad } from "../../api/api";
import styled from "styled-components";
import { NavigasjonsRad, NavigasjonsRadSkjemaGruppe } from "./StyledComponents";

const NavigasjonWrapper = styled(SkjemaGruppe)`
    @media screen and (max-width: 650px) {
    .knapp {
      font-size: 1rem;
      padding: 0 1rem;
      width: 50%;
    }
  }
`

const NavigasjonModal = styled(Modal)`
  text-align: center;
  padding: 3rem;

  @media screen and (max-width: 650px) {
    .knapp {
      font-size: 0.8em;
      padding: 0 1em;
    }
  }
  
  .navds-modal__button {
    visibility: hidden;
  }
  
  max-width: 650px;
  width: 100%;
  position: fixed !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

if (process.env.NODE_ENV !== "test") Modal.setAppElement!!("#root");

interface KnappProps {
    label?: string;
    onClick?: () => void;
}

const Navigasjon = ({
    neste,
    forrige,
    send,
    disabled,
}: {
    neste?: KnappProps;
    forrige?: KnappProps;
    send?: KnappProps;
    disabled?: boolean;
}) => {
    const { t, i18n } = useTranslation();
    const { logEvent } = useAmplitude();
    const {
        state: { sistLagretDato },
        dispatch: soknadDispatch,
    } = useSoknadContext();

    const { dispatch: brukerDispatch } = useBrukerContext();

    const dtf = Intl.DateTimeFormat(i18n.language, {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    let sistLagret;
    if (!!sistLagretDato && erDato(sistLagretDato)) {
        sistLagret = dtf.format(new Date(sistLagretDato));
    }

    const [isOpen, setIsOpen] = useState(false);

    const avbrytOgslettSoeknad = () => slettSoeknad().then(() => avbrytSoeknad());

    const avbrytSoeknad = () => {
        soknadDispatch({ type: SoknadAction.TILBAKESTILL });
        brukerDispatch({ type: BrukerAction.TILBAKESTILL });

        logEvent(LogEvents.KLIKK, { type: "avbryt soknad", svar: "ja" });
        window.location.href = "https://www.nav.no/gjenlevendepensjon"
    }

    const fortsettSoknad = () => {
        logEvent(LogEvents.KLIKK, { type: "avbryt soknad", svar: "nei" });
        setIsOpen(false)
    }

    return (
        <>
            <NavigasjonWrapper>
                <NavigasjonsRad className={`${disabled && "disabled"}`}>
                    {!!forrige && (
                        <Button variant={"primary"} type={"button"} onClick={forrige.onClick}>
                            {forrige.label || t("knapp.tilbake")}
                        </Button>
                    )}

                    {!!neste && (
                        <Button variant={"primary"} type={"button"} onClick={neste.onClick}>
                            {neste.label || t("knapp.neste")}
                        </Button>
                    )}

                    {!!send && (
                        <Button variant={"primary"} type={"button"} onClick={send.onClick}>
                            {send.label || t("knapp.sendSoeknad")} {disabled && <Loader/>}
                        </Button>
                    )}
                </NavigasjonsRad>

                {!!sistLagret && (
                    <BodyShort size={"small"} spacing className={"center mute"}>
                        {t("felles.sistLagret")}: {sistLagret}
                    </BodyShort>
                )}
            </NavigasjonWrapper>

            <NavigasjonsRadSkjemaGruppe disabled={disabled}>
                <Button id={"avbryt-btn"} variant={"secondary"} type={"button"} onClick={() => setIsOpen(true)}>
                    {t("knapp.avbryt")}
                </Button>
            </NavigasjonsRadSkjemaGruppe>

            <NavigasjonModal open={isOpen} onClose={() => setIsOpen(false)}>

                <SkjemaGruppe>
                    <Heading size={"medium"}>{t("avbrytModal.spoersmaal")}</Heading>
                </SkjemaGruppe>

                <BodyShort className="mute avbryt-text">
                    {t("avbrytModal.informasjon")}
                </BodyShort>

                <Button id={"avbryt-nei-btn"} variant={"primary"} type={"button"} onClick={fortsettSoknad}
                        style={{ margin: "10px" }}>
                    {t("avbrytModal.svarNei")}
                </Button>

                <Button id={"avbryt-ja-btn"} variant={"secondary"} type={"button"} onClick={avbrytSoeknad}
                        style={{ margin: "10px" }}>
                    {t("avbrytModal.svarJa")}
                </Button>

                <SkjemaGruppe>
                    <a href="#"
                       id={"slett-soeknad"}
                       style={{ color: "#C65D4E" }}
                       onClick={avbrytOgslettSoeknad}>{t("avbrytModal.svarSlett")}
                    </a>
                </SkjemaGruppe>
            </NavigasjonModal>
        </>
    );
};

export default Navigasjon;
