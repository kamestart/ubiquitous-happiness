process.env.NODE_ENV != "production" ? require('dotenv').config() : console.log(":)")
const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const videos = require('../models/video')
const productiono = process.env.NODE_ENV
const passport  = require('passport')
const session = require('express-session')
const memoryStore = require('memorystore')(session)

router.use(
    session({
        store: new memoryStore(),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        secure: false
    })
)
router.use(passport.initialize())
router.use(passport.session())

router.get('/', async (req, res) => {
    if (req.query.searched == null) {
        console.log(req.isAuthenticated())
        if (req.isAuthenticated()) {
            console.log(req.user)
        }
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
