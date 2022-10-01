const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const logger = require('morgan')
require('dotenv').config()
const PORT = process.env.PORT || 5000
const options = require('./config/corsOptions')

//routes
const authRoute = require('./routes/auth')

//middlewares
app.use(cors(options))
app.use(logger('combined'))

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true
    })
)

app.use('/auth', authRoute)

app.listen(PORT, ()=>{console.log(`server is running on port: ${PORT}`)})