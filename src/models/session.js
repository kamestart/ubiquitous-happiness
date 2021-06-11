const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sessionSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    uid: {
        type: Number,
        required: true
    }
})
module.exports = mongoose.model('Session', sessionSchema)
