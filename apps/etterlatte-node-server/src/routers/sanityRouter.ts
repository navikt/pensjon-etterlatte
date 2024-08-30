import express from 'express'
import config from '../config'

const sanityRouter = express.Router()

if (config.env.isSelvbetjeningUIApp) {
    import('./sanityProxy').then((sanityProxy) => {
        sanityRouter.use('/', sanityProxy.default())
    })
}

export default sanityRouter
