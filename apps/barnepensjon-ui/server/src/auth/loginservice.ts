import { TokenSet } from "openid-client"
import logger from "../monitoring/logger"
import config from "../config"

const getCookies = (req: any) => {
    const result = req.headers.cookie.split("; ")
            .map((value: any) => value.split("="))

    return Object.fromEntries(result)
}

const setup = (app: any) => {
    app.get(`${config.app.basePath}/oauth2/session`, async (req: any, res: any) => {
        const { authorization } = req.headers
        const token = authorization?.split(" ")[1]

        if (token) {
            res.send(new TokenSet(token).expires_at)
        } else {
            res.send(0)
        }
    })

    app.use(async (req: any, res: any, next: any) => {
        const { authorization } = req.headers
        const token = authorization?.split(" ")[1]

        if (token) {
            try {
                const idtoken = getCookies(req)["selvbetjening-idtoken"]

                if (!idtoken) {
                    logger.info("Mangler cookie fra loginservice. Videresender til loginservice.")
                    res.redirect(process.env.LOGINSERVICE_URL)
                } else {
                    return next()
                }
            } catch {
                logger.info("Feil ved sjekk av cookies. Videresender til loginservice.")
                res.redirect(process.env.LOGINSERVICE_URL)
            }
        } else {
            logger.info("Mangler token. Fjerner cookie fra loginservice.")
            res.cookie("selvbetjening-idtoken", "", {
                expires: new Date(0),
            })

            return next()
        }
    })
}

export default {
    setup,
}
