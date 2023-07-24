const mongoose = require('mongoose')

const Schema = mongoose.Schema



const ProdactSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',

    },
    prodacttype: [{
        type: String,
        required: true,

    }],
    name: {
        type: String,
        required: true,
        trim: true,

    },
    title: {
        type: String,
        required: true,
        trim: true,
 
    },
    image: String,
    ritng: {
        type: Number,
        default: 3.7,

    },
    price: {
        type: Number,
        required: true,
        trim: true,
    },
    visit: {
        type: Number,
        default: 0,
    }
},{ timestamps: true });





module.exports = mongoose.model('Prodact', ProdactSchema)