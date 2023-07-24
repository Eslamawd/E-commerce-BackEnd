const express = require('express')
const router = express.Router()
const Cart = require('../controller/CartControler')
const verifyJWT = require('../middleware/virivyJWT')


 

 router.route('/')
 .post(Cart.createNewCart)
 .delete( Cart.deleteProdact)
 .get(Cart.getAllCartByer)

 router.route('/v2')
 .get(Cart.getAllCartUser)

module.exports = router

