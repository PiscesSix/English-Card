const Deck = require('../models/Deck')
const User = require('../models/User')

const getUser = async (req, res, next) => {
    try {
        const users = await User.find({})
        return res.status(200).json({users})
    } catch (error) {
        return res.status(500).json({
            message: 'Error in getting users',
            error: error
        })
    }
}

const newUser = async (req, res, next) => {
    try {
        const user = new User(req.value.body)
        await user.save()
        return res.status(201).json({
            message: 'User saved successfully',
            user: user
        })
    } catch (error) {
        next(error)
    }
}

const getUserById = async (req, res, next) => {
    try {
        const { userId } = req.value.params
        const user = await User.findById(userId)
        return res.status(200).json({user})
    } catch (error) {
        next(error)
    }
}

const replaceUser = async (req, res, next) => {
    try {
        const { userId } = req.value.params
        const newUser = req.body
        const result = await User.findByIdAndUpdate(userId, newUser)
        return res.status(200).json({success: true, result: result})
    } catch (error) {
        next(error)
    }
}

const updateUser = async (req, res, next) => {
    try {
        const { userId } = req.value.params
        const newUser = req.body
        const result = await User.findByIdAndUpdate(userId, newUser)
        return res.status(200).json({success: true, result: result})
    } catch (error) {
        next(error)
    }
}

const getUserDecks = async (req, res, next) => {
    try {
        const { userId } = req.value.params
        const { decks } = await User.findById(userId).populate('decks')
        return res.status(200).json({decks})

    } catch (error) {
        next(error)
    }
}

const newUserDeck = async (req, res, next) => {
    try {
        const { userId } = req.value.params
        const newDeck = new Deck(req.value.body)
        const user = await User.findById(userId)

        newDeck.owner = user
        await newDeck.save()

        user.decks.push(newDeck._id)
        await user.save()
        return res.status(201).json({deck: newDeck})

    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAll: getUser,
    newUser: newUser,
    getUser: getUserById,
    replaceUser: replaceUser,
    updateUser: updateUser,
    getUserDecks: getUserDecks,
    newUserDeck: newUserDeck,
}