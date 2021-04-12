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

// models
const id = require('./src/models/id')
const user = require('./src/models/user')

// routers
const indexRouter = require('./src/routes/index')
const videoRouter = require('./src/routes/videos')
const userRouter = require('./src/routes/user')

// set the settings and configure routers, views, etc.
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
app.use('/users', userRouter)


// connect to mongoose

mongoose.connect(process.env.DATABASE_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })


app.listen(process.env.PORT || 3000)

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

// ------------------------------------------Code for the login and signup----------------------------------------------

// @funtion findOneModel
// @desc A function which finds a model and takes in a model, it's parameter and its value
function findOneModel(model, parameterq, value) {
    const modelToReturn = model.findOne({ parameterq : value })
    return modelToReturn
}

app.get('/signUp', (req, res) => {
    console.log("Signup process initialized")
    res.render('signUp', { production: productiono })
})

    // @route users/Signup
    // @desc signup logic

app.post('/signUp', async (req, res) => {
    try {
        const password = req.body.password
        const hashedPassword = await bcrypt.hash(password, 15)
        const newUser = new user({
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email
   })
        await newUser.save(function (err) {
            if (err) {
               console.log(`error occured at newuser.save() :  /n /n`)
                throw err;
            } else {
                console.log("New User Sucessfully Created.")
            }
        })
        res.redirect(200, '/login')
    } catch (err) {
        res.status(500).send("We Have Expirienced a Internal Server Error! Please Wait! Our Team Will Be On This Issue Immediately!")
        console.log("Hey There! We've Got An Error: " + err)
        throw err;
    }
})



app.get('/login', (req, res) => {
    res.render("login", { production: productiono })
})

app.post('/login', (req, res) => {
    
})


app.get('/oneUser/:username', async (req, res) => {
    const userToSend = findOneModel(user, "username", req.params.username)
    res.render('oneUser', { user: userToSend })
})