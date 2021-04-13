const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByUsername, getUserById) {
  const authenticateUser = async (Username, password, done) => {
    const user = await getUserByUsername(Username)
    if (user == null) {
      return done(null, false, { message: 'Incorrect Username/password' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Incorrect Password/username' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy(authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser(async (id, done) => {
    return done(null, await getUserById(id))
  })
}

module.exports = initialize