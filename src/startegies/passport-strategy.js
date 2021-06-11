const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const initialize = (passport, getUserByUsername, findById) => {
  const authenticateUser = async (Username, password, done) => {
    console.log(Username)
    console.log(password)
    const user = await getUserByUsername(Username)
    console.log(user)
    if (user == null) {
      return done(null, false, { message: 'Incorrect Username/password' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        console.log("jfr")
        return done(null, user)      
      } else {
        return done(null, false, { message: 'Incorrect Password/username' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy(authenticateUser))
  passport.serializeUser(function(user, done) {
    console.log("serial")
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      console.log("deserialize");
      const user = await findById(id)
      console.log(user)
      return done(null, user)
    } catch (err) {
      console.log('Error at deserialize: \n \n \n ' + err)
    }

  });
}

module.exports = initialize