import { Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";

export default function session(): RequestHandler {
    return async (req: Request, res: Response) => {
        const { authorization } = req.headers
        const token = authorization!!.split(' ')[1]

        if (token) {
            const decoded = jwt.decode(token)

            if (!decoded || typeof decoded === 'string') {
                res.sendStatus(500)
            } else {
                const exp = decoded['exp'] as number
                res.send(`${exp * 1000}`);
            }
        } else {
            res.sendStatus(401);
        }
    }
}
