const express = require('express')
const router = express.Router()
const user = require('../controller/userControler')
const verifyJWT = require('../middleware/virivyJWT')


 
 router.route('/')
 .get(user.getAllUsers)
 .post(user.createNewUser)
 .put(verifyJWT, user.updateUser)
 .delete(verifyJWT, user.deleteUser)
 
 router.route('/v1/:id')
 .get(user.getUser)

module.exports = router