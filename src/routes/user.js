// @funtion findOneModel
// @desc A function which finds a model and takes in a model, it's parameter and its value
function findOneModel(model, parameterq, value) {
    const modelToReturn = model.findOne({ parameterq : value })
    return modelToReturn
}

app.get('/register', (req, res) => {
    console.log("Signup process initialized")
    res.render('signUp', { production: productiono })
})

    // @route users/Signup
    // @desc signup logic

app.post('/register', async (req, res) => {
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