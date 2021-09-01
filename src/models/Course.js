const mongoose = require('mongoose')
const courseSchema = new mongoose.Schema({
    name: String,
    videos: [{ videoId: String, title: String, description: String, uploaded: Date }],
    paid: Boolean,
    price: Number,
    createDate: {
        type: Date,
        default: Date.now()
    },
    description: String,
    creator: String,
    tags: [{ title: String }]
})

module.exports = mongoose.model('Courses', courseSchema)