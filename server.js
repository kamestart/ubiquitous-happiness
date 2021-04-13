process.env.NODE_ENV != "production" ? require('dotenv').config() : console.log("In Prod Mode!")

// modules
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOveride = require('method-override')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
let productiono = process.env.NODE_ENV
const http = require('http')
const socketIo = require('socket.io')
const path = require('path')

// models
const id = require('./src/models/id')
const user = require('./src/models/user')

// start socketio
const server = http.createServer(app)
const io = socketIo(server)

// routers
const indexRouter = require('./src/routes/index')
const videoRouter = require('./src/routes/videos')

// set the settings and configure routers, views, etc.
app.disable('x-powered-by')
app.set('view engine', 'ejs')
app.set('views', __dirname + '/src/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static(__dirname + '/src/public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json({ limit: "8gb", extended: false }))
app.use(methodOveride('_method'))
app.use(cookieParser())
app.use('/videos', videoRouter)
app.use('/', indexRouter)


// connect to mongoose

mongoose.connect(process.env.DATABASE_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })



// run io when client connects!

io.on('connection', socket => {
    console.log("New Client Connected")
})



app.get('/ids/create_id', async (req, res) => {
    try {
        const whatFor = req.query.whatFor
        console.log(whatFor)
        const newID = new id({
            current_id: 1,
            forWhat: whatFor
        })
        await newID.save()
    } catch (error) {
      res.send("Error createing id: <br>" + error)
    }

})




app.get('/chat', (re, res) => {
    res.render('chat')
})




PORT = 3000 || process.env.PORT

server.listen(PORT, () => { console.log(`Listening on port ${PORT}`) })