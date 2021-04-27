
const bcrypt = require('bcrypt')
const chalk = require('chalk')
let productiono = process.env.NODE_ENV
const router = require('express').Router()
const initializePassport = require('../startegies/passport-strategy')
const mongoose = require('mongoose')
const user = require('../models/user')
const passport  = require('passport')
const session = require('express-session')
const flash  = require('express-flash')
const memoryStore = require('memorystore')(session)
const cookieParser = require('cookie-parser')
const request = require('request')

// initialize Passport

initializePassport(
    passport,
    usernamea => user.findOne({ username: usernamea }).exec(),
    ida => user.findOne({ id: ida })
)


router.use(cookieParser(process.env.SESSION_SECRET));
router.use(flash())
router.use(
    session({
        store: new memoryStore(),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        secure: process.env.isHttps,
        expires: false,
        sameSite: 'strict'
    })
)
router.use(passport.initialize())
router.use(passport.session())




router.get('/register', async (req, res) => {
    console.log("Signup process initialized")
    await res.render('userSystems/signUp', { production: productiono })
})

// @route users/Signup
// @desc signup logic

router.post('/register',  async (req, res) => {
    console.log(req.body.captcha)
    console.log("fef")
    const hashedPassword = await bcrypt.hash(req.body.password, 15)
    try {
        if (req.body.captcha === undefined || req.body.captcha === "" ||req.body.captcha === null ) {
            res.json({ "success": false, "msg": "Please select captcha" })
        } 

        // secret key
        const recaptchaSecretKey = process.env.RecaptchaSecretKey
        const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}
        &response=${req.body.captcha}&remoteip=${req.socket.remoteAddress}`

        request(verifyUrl, (err, response, body) => {
            body = JSON.parse(body)
            if(body.success == undefined && !body.success) {
                return res.json({ "success": false, "msg": "failed captcha verification" })
            }   
        })

        const newUser = new user({
            username: req.body.username,
            password: hashedPassword,
            id: Date.now().toString()
        })

        await newUser.save(function (err) {
            if (err) {
            console.log(`error occured at newuser.save() :  /n /n`)
                throw err;
            } else {
                console.log("New User Sucessfully Created.")
            }
        })
        console.log("redirect now")
        res.redirect('/userSystems/login')
        
    } catch (err) {
        const msg = "Internal Server Error! Please Wait! Our Team Will Be On This Issue Now!"
        res.status(500).send()
        console.log(chalk.red("Hey There! We've Got An Error: " + err))
        throw err;
    }
})



router.get('/login', (req, res) => {
    res.render("userSystems/login", { production: productiono })
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/userSystems/login',
    failureFlash: true
}))


router.get('/oneUser/:username', async (req, res) => {
    const userToSend = user.findOne({ username: req.params.username })
    res.render('oneUser', { user: userToSend })
})


router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }

module.exports = router

