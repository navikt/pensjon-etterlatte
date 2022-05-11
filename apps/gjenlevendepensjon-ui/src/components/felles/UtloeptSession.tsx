import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LukkbarAlert from "./LukkbarAlert";
import { hentUtloepstidForInnlogging } from "../../api/api";
import { konverterSekunderTilTid } from "../../utils/konverterSekunderTilTid";
import WebWorker from "../../utils/workers/WebWorker";

const UtloeptSession = () => {
    const [open, setIsOpen] = useState<boolean>(false);
    const [harBlittLukket, setHarBlittLukket] = useState<boolean>(false);
    const [loggerUt, setLoggerUt] = useState<boolean>(false);
    const [tidIgjen, setTidIgjen] = useState<number>();
    const [tid, setTid] = useState(konverterSekunderTilTid(0));
    const { t } = useTranslation();

    useEffect(() => {
        hentUtloepstidForInnlogging().then((utloepstid: string) => {
            const sluttTid = new Date(utloepstid);
            WebWorker.registrerNedtellingsLytter({ sluttTid: sluttTid.getTime(), callbackFn: setTidIgjen });
        });

        return () => {
            if (WebWorker) WebWorker.fjernNedtellingsLytter();
        };
    }, []);

    useEffect(() => {
        if (typeof tidIgjen !== "number") return;

        const femMinutter = 5 * 60;
        setTid(konverterSekunderTilTid(tidIgjen));

        if (tidIgjen <= 0) {
            setLoggerUt(true);
            loggUt();
        } else if (tidIgjen <= femMinutter && !harBlittLukket) {
            setIsOpen(true);
        }
    }, [tidIgjen]);

    const loggUt = async () => {
        try {
            const response: string = await hentUtloepstidForInnlogging();

            const sluttTid = new Date(response).getTime();
            const naaTid = new Date().getTime();

            if (sluttTid <= naaTid) {
                window.location.reload();
            } else {
                const sluttTid = new Date(response);
                WebWorker.oppdaterSluttTid(sluttTid.getTime());
                setLoggerUt(false);
            }
        } catch (error) {
            window.location.reload();
        }
    };

    return (
        <>
            {open && (
                <div className="utlogging-alert-wrap">
                    <LukkbarAlert
                        onClose={() => {
                            setIsOpen(false);
                            setHarBlittLukket(true);
                        }}
                    >
                        {loggerUt ? (
                            <span>{t("brukerLoggesUt.loggerUt")}</span>
                        ) : (
                            <span>
                                {`${t("brukerLoggesUt.info1")} `}
                                <strong>
                                    {`${tid.minutter.toString().padStart(2, "0")}:${tid.sekunder
                                        .toString()
                                        .padStart(2, "0")}`}
                                </strong>
                                {` ${t("brukerLoggesUt.tid")}.
                            ${t("brukerLoggesUt.info2")}`}
                            </span>
                        )}
                    </LukkbarAlert>
                </div>
            )}
        </>
    );
};

export default UtloeptSession;
