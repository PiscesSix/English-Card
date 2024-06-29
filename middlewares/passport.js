const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const user = require('../controllers/user');

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: 'MySecretKey'
}, async (payload, done) => {
    try {
        const user = await User.findById(payload.sub)
        if (!user) {
            return done(null, false)
        }
        done(null, user)
    } catch (error) {
        done(error, false)
    }
}))

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({email})
        if (!user) {
            return done(null, false)
        }
        const isCorrectPassword = await user.isValidPassword(password)
        if (!isCorrectPassword) {
            return done(null, false)
        }
        done(null, user)
    } catch (error) {
        done(error, false)}
}))