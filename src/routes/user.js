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
var cors = require('cors')
const jwt = require('jsonwebtoken')
const Session = require('../models/session')

// initialize Passport

const corsOptions = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-type, Accept,  X-Custom-Header',
    'Access-Control-Request-Methods': 'POST, GET, DELETE, UPDATE, PATCH, OPTIONS'
}

router.options('*', cors(corsOptions))

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



function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}



const verifyJWT = async (req, res, next) => {
    try {
        const token = await req.headers['x-access-token']
        const sid = req.body.sid
        const session = await Session.findOne({ id: sid })

        if (!token) {
            return res.json({ msg: 'pls authenticate'})
        }

        jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
            if(err) {
                console.log(err)
                return res.json({ msg: 'u failed to authenticate :(', auth: false })
            }   
                
            if(session.uid !== decoded.id) {
                req.userId = decoded.id;
                next()
            } else {
                res.json({ msg: "Yo! Why Are You Trying To Send a fake / expired token / session id????" })
            }

        })
    } catch(err) {
        throw err;
    }
}
 
router.post('/logout', cors(corsOptions), async (req, res) => {
    await Session.findOne({ id: req.body.sid }).remove()
    res.json({ msg: "Logout successful" })
})    

router.post('/currentUserInfo', cors(corsOptions), verifyJWT, async (req, res) => {
    const usera = await user.findOne({ id: req.userId })
    res.json({ user: usera })
})


// @route users/Signup
// @desc signup logic

router.post('/register', cors(corsOptions), async (req, res) => {
    console.log(req.body)
    let body = JSON.parse(req.body.bodymine)
    console.log(body)
    try {
        if (body.captcha === undefined || body.captcha === "" || body.captcha === null ) {
            return res.json({ "RedirectUrl" : "/register", "success": false, "msg": "Please select captcha" })
        } 

        // secret key
        const recaptchaSecretKey = process.env.RecaptchaSecretKey
        const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}
        &response=${body.captcha}&remoteip=${req.socket.remoteAddress}`

        request(verifyUrl, (err, response, body) => {
            let body4f = JSON.parse(body)
            if(body4f.success == undefined || !body4f.success) {
                return res.json({ "success": false, "msg": "failed captcha verification" })
            }   
        })

        const hashedPassword = await bcrypt.hash(body.password, 15)

        const newUser = new user({
            username: body.username,
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
        res.json({ "RedirectUrl" : "/login", "msg": "new user created successfully!"})
        
    } catch (err) {
        res.status(500).send("err. err. err. err. pls wait.")
        console.log(chalk.red("Error: There is a " + err))
        throw err;
    }
})

router.post('/login', cors(corsOptions), async (req, res) => {
    try {
        let body = await JSON.parse(req.body.payload)
        console.log(body)
        const userNow = await user.findOne({ username: body.name })
        if (!userNow) {
            return res.json({ msg: 'No user with that username!!!!!!', success: false  })
        }

        await bcrypt.compare(body.password, userNow.password, (err, same) => {
            if (err) {
                return res.json({ msg: "err. errr. errrr. please try later..." , error: err}) 
            }

            if (same){
                var id = userNow.id
                var sid = getRandomIntInclusive(100000000000000, 999999999999999)

                const token = jwt.sign({id}, process.env.SESSION_SECRET, {
                    expiresIn: 3600
                })
                


                req.session.user = userNow
                const newSession = new Session({
                        id: sid,
                        uid: id
                })

                newSession.save();
                res.json({ success: true, auth: true, token: token, usera: userNow, message: 'logged in', sidd: sid })
            } else {
                res.json({ msg: 'incoorect password' })
            }

        })

    } catch (err) {
        res.status(500).send(err)
        console.log(err)
    }
})


router.get('/oneUser/:username', async (req, res) => {
    const userToSend = await user.findOne({ username: req.params.username })
    res.json({ userToSend })
})
 
  

module.exports = router

