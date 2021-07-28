const Router = require('express').Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const challenge = require('../models/Channel')

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

router.get('/getOne/:id', async (req, res) => {
    res.json({ challenge: await challenge.findOne({_id: req.params.id}) })
})

router.post('/new', cors(corsOptions), verifyJWT, async (req, res) => {
    try{
        await new challenge({
            title: req.body.title,
            description: req.body.desc,
            tests: req.body.tests,
            creator: req.userId,
            DateCreated:Date.now()
        }).save(function (err) {
            if (err) {
                console.log(`error occured at newChallenge.save() :  \n \n`)
                throw err;
            } else {
                console.log("New CHallenge Sucessfully Created.")
                res.json({ msg: 'Success! New Video Created', sucess: true })
            }})

    
    } catch(err) {
        throw err;
    }
})

router.update('/update', (req, res) => {

})