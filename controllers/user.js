const User = require('../models/User')

const index = (req, res) => {
    User.find()
        .then(users => {
            res.status(200).json({
                message: 'Get all users',
                users: users
            })
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error in fetching users',
                error: err
            })
        })
}

const newUser = (req, res, next) => {
    // const user = new User({
    //     firstName: req.body.firstName,
    //     lastName: req.body.lastName,
    //     email: req.body.email
    // })
    const user = new User(req.body)

    user.save((err, user) => {
        if (err) {
            return res.status(500).json({
                message: 'Error in saving user',
                error: err
            })
        }
        res.status(201).json({
            message: 'User saved successfully',
            user: user
        })
    })
}

module.exports = {
    getAll: index,
    newUser: newUser
}