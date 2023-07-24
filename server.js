const express = require('express')
const router = express.Router()
require('dotenv').config()
const app = express()
const path = require('path')
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const { logEvents } = require('./middleware/logger')
const port = process.env.PORT || 3500


console.log(process.env.NODE_ENV)

mongoose.set('strictQuery', true)

connectDB()

app.use(logger)


app.use(bodyParser.urlencoded({extended: true}))


app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'uploads')))



app.use('/auth', require('./routes/authRouts'))
app.use('/user', require('./routes/userRoutes'))
app.use('/prodact', require('./routes/prodactRoutes'))
app.use('/cart', require('./routes/cartRouts'))

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({massege:'404 Not Found'})
    } else {
        res.type('text').send ('404 Not Found')
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('connect DB')
    app.listen(port, () => console.log(`server runing ${port}`))
});

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
});
