const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    roles: {
        User: {
        type: Number,
        default: "20001000"
            },
        
            Editor: Number,
            Admin: Number,
},   
    active: {
        type: Boolean,
        default: true
    },
    numberphone: {
        type: Number,
        required: true,
        trim: true,

    },
    refreshToken: String
}, { timestamps: true });


module.exports = mongoose.model('User', userSchema)