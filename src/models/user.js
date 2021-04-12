const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    hasChannel: {
        type: Boolean,
        required: true,
        default: false,
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    dateJoined: {
        type: Date,
        default: Date.now(),
        required: true
    }, reputation: {
        type: Number,
        required: true,
        default: 0
    }    
})

module.exports = mongoose.model('Users', userSchema)