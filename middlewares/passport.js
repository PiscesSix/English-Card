const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const user = require('../controllers/user');

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: process.env.JWT_SECRET
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

passport.use('googleToken', new GooglePluTokenStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // In google Oauthen
        const user = await User.findOne({authGoogleID: profile.id, authType: 'google'})
        if (user) {
            return done(null, user)
        }
        
        // In account
        const userInAccountWithEmail = await User.findOne({email: profile.emails[0].value})
        if (userInAccountWithEmail) {
            return done(null, userInAccountWithEmail)
        }

        const newUser = new User({
            authGoogleID: profile.id,
            authType: 'google',
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value
        })
        await newUser.save()
        done(null, newUser)
    } catch (error) {
        done(error, false, error.message)
    }
}))