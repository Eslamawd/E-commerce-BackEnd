const mongoose = require('mongoose')

const Schema = mongoose.Schema



const CartUser = new Schema({
    Buyer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',

    },
    prodact: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Prodact',

    },

 
},{ timestamps: true });





module.exports = mongoose.model('Cart', CartUser)