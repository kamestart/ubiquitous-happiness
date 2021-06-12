process.env.NODE_ENV != "production" ? require('dotenv').config() : console.log(":)")

// modules
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOveride = require('method-override')
const cookieParser = require('cookie-parser')   
const passport = require('passport')
const session = require('express-session')
const memoryStore = require('memorystore')(session)
const formatMessage = require('./src/utils/messages')


// models
const id = require('./src/models/id')
const user = require('./src/models/user')

// start socketio
const http = require('http').Server(app)

// routers
const indexRouter = require('./src/routes/index')
const videoRouter = require('./src/routes/videos')
const userSystemsRouter = require('./src/routes/user')

// set the settings and configure routers, views, etc.
app.disable('x-powered-by')
app.set('view engine', 'ejs')
app.set('views', __dirname + '/src/views')
app.set('layout', 'layouts/layout')


app.use(express.static(__dirname + '/src/public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json({ limit: "8gb", extended: false }))
app.use(methodOveride('_method'))
app.use(cookieParser())
app.use('/videos', videoRouter)
app.use('/', indexRouter)
app.use('/userSystems', userSystemsRouter)

// connect to mongoose

mongoose.connect(process.env.DATABASE_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })


http.listen(process.env.PORT || 5500, () => { console.log(`Listening on port ${process.env.PORT || 5500}`) })


