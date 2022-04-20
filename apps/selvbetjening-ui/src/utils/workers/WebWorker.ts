import Worker from "worker-loader!./nedteller.worker";
import { NedtellingsMelding } from "../../typer/nedteller";

class WebWorker {
    private worker!: Worker;
    private sluttTid?: number;
    private callbackFn?: (remainingTime: number) => void;
    private nedteller?: NodeJS.Timer;

    constructor() {
        if (!window.Worker) {
            console.warn("Webworkers not supported, will use regular intervals");
            return;
        }
        this.worker = new Worker();
        this.initialiser();
    }

    private initialiser() {
        this.worker.onmessage = (event: MessageEvent<{ msg: NedtellingsMelding; id: string; periode: number }>) => {
            const data = event.data;

            if (!data) return;

            if (data?.msg === NedtellingsMelding.NEDTELLINGS_NOTIFIKASJON) {
                if (this.callbackFn) {
                    this.callbackFn(data.periode);
                }
            }
        };
    }

    private lyttTilWorker = () => {
        try {
            this.worker.postMessage({ msg: NedtellingsMelding.REGISTRER_NEDTELLINGS_LYTTER, sluttTid: this.sluttTid });
        } catch (e) {
            console.log(e);
            console.log("Unable to register listener, starting default interval.");
            this.nedteller = setInterval(() => {
                this.sendNedtellingBackup(new Date().valueOf());
            }, 1000);
        }
    };

    registrerNedtellingsLytter = ({
        sluttTid,
        callbackFn,
    }: {
        sluttTid: number;
        callbackFn: (props: number) => void;
    }) => {
        if (!this.worker) {
            throw new Error("No webworker detected, the browser might not support it");
        }
        this.sluttTid = sluttTid;
        this.callbackFn = callbackFn;
        this.lyttTilWorker();
    };

    fjernNedtellingsLytter = () => {
        this.worker.postMessage({ msg: NedtellingsMelding.FJERN_NEDTELLINGS_LYTTER });
        if (this.nedteller) {
            clearInterval(this.nedteller);
        }
    };

    oppdaterSluttTid = (sluttTid: number) => {
        this.worker.postMessage({ msg: NedtellingsMelding.OPPDATER_NEDTELLINGS_LYTTER, sluttTid });
    };

    sendNedtellingBackup = (naavaerendeTid: number) => {
        if (!this.callbackFn || !this.sluttTid) return;
        const periode = Math.floor((this.sluttTid - naavaerendeTid.valueOf()) / 1000);

        this.callbackFn(periode);
    };
}

export default new WebWorker();
