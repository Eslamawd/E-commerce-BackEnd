const express = require('express')
const router = express.Router()
const authController = require('../controller/authControler')
const loginLimiter = require('../middleware/loginLimit')


router.route('/')
    .post(loginLimiter, authController.login)


router.route('/refresh')
    .get(authController.refresh)

router.route('/logout')
    .post(authController.logout)



module.exports = router