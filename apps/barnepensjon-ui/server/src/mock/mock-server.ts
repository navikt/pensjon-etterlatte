import express from 'express'
import { mockApi } from './mock-api'

const app = express()

mockApi(app)

const port = process.env.PORT || 8085
app.listen(port, () => {
    console.log(`App listening on port: ${port}`)
})
