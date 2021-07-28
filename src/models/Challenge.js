const mongoose = require('mongoose')

const ChallengeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tests: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: true
    },
    DateCreated: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Challenge', ChallengeSchema)