const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
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
        required: false
    },
    dateJoined: {
        type: Date,
        default: Date.now(),
        required: true
    }, reputation: {
        type: Number,
        required: true,
        default: 0
    },
    id: {
        type: String,
        required: true
    }    
})

module.exports = mongoose.model('Users', userSchema)