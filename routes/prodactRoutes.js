const express = require('express')
const router = express.Router()
const prodact = require('../controller/ProdactControler')
const ROLS_LIST = require('../config/rols_list')
const verifyRols = require('../middleware/verifyRols')
const verifyJWT = require('../middleware/virivyJWT')
const upload = require('../controller/Image')


router.route('/')
    .get(prodact.getAllProudacts)
    .post(upload.single('image'), prodact.createNewProdact)
    .put(verifyRols(ROLS_LIST.Admin,ROLS_LIST.Editor), prodact.updateProdact)
    .delete(verifyRols(ROLS_LIST.Admin), prodact.deleteProdact)

router.route('/v1')
    .get(prodact.getProType)

router.route('/:id')
    .get(prodact.getProudact)

module.exports = router