process.env.NODE_ENV != "production" ? require('dotenv').config() : console.log(":)")
const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const videos = require('../models/video')
const productiono = process.env.NODE_ENV
const passport  = require('passport')
const session = require('express-session')
const memoryStore = require('memorystore')(session)
const cors = require('cors')

const corsOptions = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-type, Accept,  X-Custom-Header',
    'Access-Control-Request-Methods': 'POST, GET, DELETE, UPDATE, PATCH, OPTIONS'
}


router.options('*', cors(corsOptions))


module.exports = router
