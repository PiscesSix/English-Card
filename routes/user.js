const express = require('express')
const router = express.Router()

const UserController = require('../controllers/user')

router.route('/')
    .get(UserController.getAll)
    .post(UserController.newUser)    

module.exports = router