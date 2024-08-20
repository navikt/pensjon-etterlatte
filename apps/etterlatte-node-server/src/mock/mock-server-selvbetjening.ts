import express from 'express'
import { mockSelvbetjeningApi } from './mock-selvbetjening-api'

const app = express()

mockSelvbetjeningApi(app)

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`App listening on port: ${port}`)
})
