const router = require('express').Router()
const cors = require('cors')
const Course = require('../models/Course')
const jwt = require('jsonwebtoken')

const corsOptions = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-type, Accept,  X-Custom-Header',
    'Access-Control-Request-Methods': 'POST, GET, DELETE, UPDATE, PATCH, OPTIONS'
}


const verifyJWT = async (req, res, next) => {
    try {
        const token = await req.headers['x-access-token']
        const sid = req.body.sid
        const session = await Session.findOne({ id: sid })
        if (!token) {
            return res.json({ msg: 'pls authenticate' })
        }

        jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
            if (err) {
                console.log(err)
                return res.json({ msg: 'u failed to authenticate :(', auth: false })
            }

            if (session.uid !== decoded.id) {
                req.userId = decoded.id;
                next()
            } else {
                res.json({ msg: "Yo! Why Are You Trying To Send a fake / expired token / session id????" })
            }

        })
    } catch (err) {
        throw err;
    }
}


router.options('*', cors(corsOptions))

router.get('/info/:id', cors(corsOptions), async (req, res) => {
    const final = await Course.findOne({ _id: req.params.id })
    console.log(final)
    return res.json({ test: final })
})

router.post('/new', cors(corsOptions), verifyJWT, async (req, res) => {
    try {
        const final = new Course({

        })
    } catch (err) {
        throw err;
    }
})

module.exports = router