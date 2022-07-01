const express = require('express')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

app.use(express.static(path.join(__dirname, 'dist')))

app.get('/isalive', (req, res) => {
    res.sendStatus(200)
})
app.get('/isready', (req, res) => {
    res.sendStatus(200)
})

app.listen(3333, () => {
    console.log('Sanity running on port 3333')
})