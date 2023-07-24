const rateLimit = require('express-rate-limit')
const { logEvents } = require('./logger')


const loginLimiter = rateLimit({
    windowMs:  60 * 1000,
    max: 10,
    message:
        { message: 'too many login please try again after a 1 houre'},
    handler: (req, res, next, options)  => {
        logEvents(`to many requests: ${options.message.message}\t${req.method}\t${req.url}\t
        ${req.headers.origin}`, 'errLog.log')
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true,
    legacyHeaders: false,
})

module.exports = loginLimiter