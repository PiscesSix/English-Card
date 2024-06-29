const express = require('express')
const router = express.Router()

const UserController = require('../controllers/user')
const passport = require('passport')
require('../middlewares/passport') // config cho passport

const { validateBody, validateParam, schemas } = require('../helpers/routeHelpers')

router.route('/')
    .get(UserController.getAll)
    .post(validateBody(schemas.userSchema), UserController.newUser)

router.route('/signup').post(validateBody(schemas.authSignUpSchema), UserController.signUp)

router.route('/signin').post(validateBody(schemas.authSignInSchema), passport.authenticate('local', { session: false }), UserController.signIn)

router.route('/secret').get(passport.authenticate('jwt', { session: false }), UserController.secret)

router.route('/:userId')
    .get(validateParam(schemas.idSchema,'userId'), UserController.getUser)
    .put(validateParam(schemas.idSchema,'userId'), validateBody(schemas.userSchema), UserController.replaceUser)
    .patch(validateParam(schemas.idSchema,'userId'), validateBody(schemas.userOptionalSchema), UserController.updateUser)

router.route('/:userId/decks')
    .get(validateParam(schemas.idSchema, 'userId'), UserController.getUserDecks)
    .post(validateParam(schemas.idSchema, 'userId'), validateBody(schemas.deckSchema), UserController.newUserDeck)
    
module.exports = router