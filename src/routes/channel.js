process.env.NODE_ENV != "production" ? require('dotenv').config() : console.log(":)")
const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const cors = require('cors')
const optosn = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-type, Accept,  X-Custom-Header',
    'Access-Control-Request-Methods': 'POST, GET, DELETE, UPDATE, PATCH, OPTIONS'
}
const Channel = require('../models/Channel')

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


router.options('*', cors(optosn))

router.post('/new', cors(optosn), (req, res) => {
    res.send('new')
})

router.patch('/update', cors(optosn), (req, body) => {

})

router.delete('/delete', cors(optosn), (req, res) => {

})

router.post('/getuserchannels', cors(optosn), (req, res) => {

})