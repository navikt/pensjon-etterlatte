import { NedtellingsMelding } from '../../typer/nedteller'
import {logger} from "../logger";

let nedteller: ReturnType<typeof setInterval>
let teller = false
let sluttTid = 0

const sendNedtellingsMelding = (periode: number) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    self.postMessage({ msg: NedtellingsMelding.NEDTELLINGS_NOTIFIKASJON, periode })
}

const giBeskjedTilNedtellingsLytter = () => {
    const naavaerendeTid = new Date()
    const periode = Math.floor((sluttTid - naavaerendeTid.valueOf()) / 1000)

    sendNedtellingsMelding(periode)
}

const startNedteller = () => {
    teller = true
    nedteller = setInterval(() => {
        giBeskjedTilNedtellingsLytter()
    }, 1000)
}

const stoppNedteller = () => {
    teller = false
    clearInterval(nedteller)
}

const registrerNedtellingsLytter = (nySluttTid: number) => {
    sluttTid = nySluttTid
    if (!teller) {
        startNedteller()
    }
}

const fjernNedtellingsLytter = () => {
    if (teller) {
        stoppNedteller()
    }
}

self.onmessage = async (event: MessageEvent<{ msg: NedtellingsMelding; sluttTid: number }>) => {
    const data = event?.data

    if (!data?.msg) return

    if (event.origin) {
        logger.info(event.origin)
    }

    switch (data.msg) {
        case NedtellingsMelding.REGISTRER_NEDTELLINGS_LYTTER:
            return registrerNedtellingsLytter(data.sluttTid)
        case NedtellingsMelding.OPPDATER_NEDTELLINGS_LYTTER:
            return registrerNedtellingsLytter(data.sluttTid)
        case NedtellingsMelding.FJERN_NEDTELLINGS_LYTTER:
            return fjernNedtellingsLytter()
        default:
    }
}
