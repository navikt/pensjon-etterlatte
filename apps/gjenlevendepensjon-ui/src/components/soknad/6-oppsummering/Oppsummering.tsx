import { Alert, BodyLong, Button, Heading, Link, Loader } from '@navikt/ds-react'
import { isEmpty } from "lodash";
import { SkjemaGruppe } from "../../felles/SkjemaGruppe";
import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { sendSoeknad } from "../../../api/api";
import { SoeknadRequest, SoeknadType } from "../../../api/dto/InnsendtSoeknad";
import { mapTilBarnepensjonSoeknadListe, mapTilGjenlevendepensjonSoeknad } from "../../../api/mapper/soeknadMapper";
import { useBrukerContext } from "../../../context/bruker/BrukerContext";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import SoknadSteg from "../../../typer/SoknadSteg";
import { LogEvents, useAmplitude } from "../../../utils/amplitude";
import SoeknadMapper from "../../../utils/SoeknadMapper";
import Navigasjon from "../../felles/Navigasjon";
import OppsummeringInnhold from "./OppsummeringInnhold";
import { ActionTypes } from "../../../context/soknad/soknad";
import {NavigasjonsRad, SpoersmaalModal} from "../../felles/StyledComponents";
import { SkjemaElement } from "../../felles/SkjemaElement";

const Oppsummering: SoknadSteg = memo(({ forrige }) => {
    const navigate = useNavigate();
    const [soeknadOppsummering, setOppsummering] = useState<any>([]);
    const { t } = useTranslation();

    const { state: soeknad, dispatch } = useSoknadContext();
    const { state: bruker } = useBrukerContext();
    const { logEvent } = useAmplitude();

    const [senderSoeknad, setSenderSoeknad] = useState(false);
    const [error, setError] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const mapper = new SoeknadMapper(t);

    useEffect(() => {
        (async () => {
            if (isEmpty(soeknad) || isEmpty(bruker)) {
                setOppsummering([]);
            } else {
                const soeknadOppsummering = mapper.lagOppsummering(soeknad, bruker);
                setOppsummering(soeknadOppsummering);
            }
        })();
    }, [soeknad, bruker]);

    const send = () => {
        setSenderSoeknad(true);
        setError(false);

        const gjenlevendepensjon = mapTilGjenlevendepensjonSoeknad(t, soeknad, bruker);
        const barnepensjonSoeknader = mapTilBarnepensjonSoeknadListe(t, soeknad, bruker);

        const soeknadBody: SoeknadRequest = {
            soeknader: [gjenlevendepensjon, ...barnepensjonSoeknader],
        };

        sendSoeknad(soeknadBody)
            .then(() => {
                logEvent(LogEvents.SEND_SOKNAD, { type: SoeknadType.GJENLEVENDEPENSJON });

                barnepensjonSoeknader.forEach(() => {
                    logEvent(LogEvents.SEND_SOKNAD, { type: SoeknadType.BARNEPENSJON });
                });

                dispatch({ type: ActionTypes.TILBAKESTILL });
                navigate(`/skjema/sendt`);
            })
            .catch((error) => {
                setIsOpen(false)
                console.log(error);
                setSenderSoeknad(false);
                setError(true);
            });
    };

    return (
        <>
            <SkjemaElement>
                <Heading size={"medium"} className={"center"}>
                    {t("oppsummering.tittel")}
                </Heading>
            </SkjemaElement>

            <SkjemaElement>
                <BodyLong>{t("oppsummering.beskrivelse")}</BodyLong>
            </SkjemaElement>

            {!isEmpty(soeknadOppsummering) && (
                <OppsummeringInnhold soeknadOppsummering={soeknadOppsummering} senderSoeknad={senderSoeknad} />
            )}

            <br />

            {error && (
                <SkjemaGruppe>
                    <Alert variant={"error"}>
                        {t("oppsummering.feilVedSending")}
                        <Link href={t("oppsummering.feilVedSending.href")}>
                            {t("oppsummering.feilVedSending.tittel")}
                        </Link>
                    </Alert>
                </SkjemaGruppe>
            )}

            <Navigasjon forrige={{ onClick: forrige }} send={{ onClick: () => setIsOpen(true) }} disabled={senderSoeknad} />

            <SpoersmaalModal open={isOpen}
                    onClose={() => {
                        if (!senderSoeknad) setIsOpen(false)
                    }}
                shouldCloseOnOverlayClick={false}
                 data-testid={"spoersmaal-modal"}
                >


                <SkjemaElement>
                    <Heading size={'medium'}>{t(senderSoeknad ? 'oppsummering.senderSoeknad.tittel' : 'oppsummering.sendSoeknad.tittel')}</Heading>
                </SkjemaElement>

                <SkjemaElement>
                    {senderSoeknad ? (
                            <Loader size={'xlarge'} />
                    ) : (
                            <BodyLong size={'small'}>{t('oppsummering.sendSoeknad.innhold')}</BodyLong>
                    )}
                </SkjemaElement>
                {!senderSoeknad && (
                        <NavigasjonsRad>
                            <Button
                                    id={'avbryt-ja-btn'}
                                    variant={'secondary'}
                                    type={'button'}
                                    onClick={() => setIsOpen(false)}
                                    style={{ margin: '10px' }}
                            >
                                {t('knapp.nei')}
                            </Button>
                            <Button
                                    id={'avbryt-nei-btn'}
                                    variant={'primary'}
                                    type={'button'}
                                    onClick={send}
                                    style={{ margin: '10px' }}
                            >
                                {t('knapp.ja')}
                            </Button>
                        </NavigasjonsRad>
                )}
            </SpoersmaalModal>
        </>
    );
});

export default Oppsummering;
