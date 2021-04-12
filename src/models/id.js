const mongoose = require('mongoose')

const idSchema = new mongoose.Schema({
    current_id: {
        type: Number,
        required: true
    }, forWhat: {
        type: String,
        required: true
    } 
})

module.exports = mongoose.model('id', idSchema)