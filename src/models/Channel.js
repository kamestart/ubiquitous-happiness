const mongoose = require('mongoose')
const schema = mongoose.Schema

const channelSchema = new schema({
    admins: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    videos: [
        { type: String }
    ],

    name:{
        type: String
    },

    description: {
        type: String
    }
})

module.exports = mongoose.model('channel', channelSchema)