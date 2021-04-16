process.env.NODE_ENV != "production" ? require('dotenv').config() : console.log(":)")
const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const videos = require('../models/video')
const productiono = process.env.NODE_ENV




router.get('/', async (req, res) => {
    if (req.query.searched == null) {
        console.log(req.user.username)
        res.render('index', { production: productiono, user: req.user })
    } else {
        var searchQuery = req.query.searched.toUpperCase()
        if (searchQuery != "" || " ") {

            searchResults = await videos.find({ title:{$regex: '.*' + searchQuery + '.*'}}, 'title description fileName originalName thumbnailFileName')
            if (searchResults != []) {
                res.render('video_searched.ejs', { results: searchResults, production: process.env.NODE_ENV, production: productiono })
            } else {
                res.send('No File!')
            }
        } else {
            res.render('index')
        }
    }

})

module.exports = router
