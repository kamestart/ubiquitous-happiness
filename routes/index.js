const express = require('express')
const { Mongoose } = require('mongoose')
const router = express.Router()
const videos = require('../models/video')

router.get('/', async (req, res) => {
    if (req.query.searched == null) {
        res.render('index')
    } else {
        var searchQuery = req.query.searched.toUpperCase()
        if (searchQuery != "" || " ") {

            searchResults = await videos.find({ title:{$regex: '.*' + searchQuery + '.*'}}, 'title description fileName originalName thumbnailFileName')
            if (searchResults != []) {
                res.render('video_searched.ejs', { results: searchResults, production: process.env.NODE_ENV })
            } else {
                
            }
        } else {
            res.render('index')
        }
    }

})

module.exports = router