
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
// initialize Passport

initializePassport(
    passport,
    usernamea => user.findOne({ username: usernamea }).exec(),
    id => user.findOne({ ObjectId: id }).exec()
)



router.use(flash())
router.use(
    session({
        store: new memoryStore(),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
)
router.use(passport.initialize())
router.use(passport.session())




router.get('/register', async (req, res) => {
    console.log("Signup process initialized")
    await res.render('signUp', { production: productiono })
})

// @route users/Signup
// @desc signup logic

router.post('/register', async (req, res) => {
    try {
        const password = req.body.password
        const hashedPassword = await bcrypt.hash(password, 15)
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
        res.redirect('/userSystems/login')
    } catch (err) {
        res.status(500).send("We Have Expirienced a Internal Server Error! Please Wait! Our Team Will Be On This Issue Immediately!")
        console.log(chalk.red("Hey There! We've Got An Error: " + err))
        throw err;
    }
})



router.get('/login', (req, res) => {
    res.render("login", { production: productiono })
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: 'userSystems/login',
    failureFlash: true
}))


router.get('/oneUser/:username', async (req, res) => {
    const userToSend = user.findOne({ username: req.params.username })
    res.render('oneUser', { user: userToSend })
})


router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
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

