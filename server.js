process.env.NODE_ENV != "production" ? require('dotenv').config() : console.log("In Prod Mode!")

// modules
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOveride = require('method-override')
const cookieParser = require('cookie-parser')

// routers
const indexRouter = require('./routes/index')
const videoRouter = require('./routes/videos')
const userRouter = require('./routes/user')


app.disable('x-powered-by')
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json({ limit: "8gb", extended: false }))
app.use(methodOveride('_method'))
app.use(cookieParser())
app.use('/videos', videoRouter)
app.use('/', indexRouter)
app.use('/user', userRouter)


// connect to mongoose

mongoose.connect(process.env.DATABASE_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })


app.listen(process.env.PORT || 3000)
















/* Since you are new to the got moduke here is some sample code:
        const {body} = await got.get('link', {
            json: {
                
            },
            responseType: 'json'
        })*/