const express = require('express')
const router = express.Router()

const UserController = require('../controllers/user')

router.route('/')
    .get(UserController.getAll)
    .post(UserController.newUser)

router.route('/:userId')
    .get(UserController.getUser)
    .put(UserController.replaceUser)
    .patch(UserController.updateUser)

router.route('/:userId/decks')
    .get(UserController.getUserDecks)
    .post(UserController.newUserDeck)
    
module.exports = router