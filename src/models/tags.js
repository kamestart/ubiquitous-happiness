const mongoose = require('mongoose')

const tagSchema = new mongoose.Schema({
    name: String,
    refs: Number,
    desc: String
})

module.exports = mongoose.model('Tags', tagSchema)