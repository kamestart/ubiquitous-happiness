const mongoose = require('mongoose')
const schema = mongoose.Schema

const videoSchema = new schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now()
    },
    likes: {
        type: Number,
        required: true,
        default: 0
    },
    dislikes: {
        type: Number,
        required: true,
        default: 0
    }, originalName: {
        type: String,
        required: true
    }, thumbnailFileName: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true
    },
    creator: {
        type: String,
        required: true 
    },     

})


module.exports = mongoose.model('video', videoSchema)