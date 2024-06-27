const express = require('express')
const router = express.Router()

const UserController = require('../controllers/user')

const { validateBody, validateParam, schemas } = require('../helpers/routeHelpers')

router.route('/')
    .get(UserController.getAll)
    .post(validateBody(schemas.userSchema), UserController.newUser)

router.route('/:userId')
    .get(validateParam(schemas.idSchema,'userId'), UserController.getUser)
    .put(validateParam(schemas.idSchema,'userId'), validateBody(schemas.userSchema), UserController.replaceUser)
    .patch(validateParam(schemas.idSchema,'userId'), validateBody(schemas.userOptionalSchema), UserController.updateUser)

router.route('/:userId/decks')
    .get(validateParam(schemas.idSchema, 'userId'), UserController.getUserDecks)
    .post(validateParam(schemas.idSchema, 'userId'), validateBody(schemas.deckSchema), UserController.newUserDeck)
    
module.exports = router