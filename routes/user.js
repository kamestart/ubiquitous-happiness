const user = require('../models/user')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

router.get('/signUp', (req, res) => {
    res.render('userSignUp')
})

// @funtion findOneModel
// @desc A function which finds a model and takes in a model, it's parameter and its value
function findOneModel(model, parameter, value) {
    const modelToReturn = model.findOne({ parameter: value })
    return modelToReturn
}

router.post('/signUp', async (req, res) => {
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
        res.redirect('/', 201)
    } catch (err) {
        res.status(500).send("We Have Expirienced a Internal Server Error! <br> Please Wait! Our Team Will Be On This Issue Immediately!")
        throw err;
    }
})

router.get('/oneUser/:username', async (req, res) => {
    const userToSend = findOneModel(user, "username", req.params.username)
    res.render('oneUser', { user: userToSend })
})

module.exports = router 