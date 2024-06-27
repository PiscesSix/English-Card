const Deck = require('../models/Deck')
const User = require('../models/User')

const getAll = async (req, res, next) => {
    try {
        const decks = await Deck.find({})
        return res.status(200).json({decks})
    } catch (error) {
        return res.status(500).json({
            message: 'Error in getting decks',
            error: error
        })
    }
}

const newDeck = async (req, res, next) => {
    try {
        const owner = await User.findById(req.value.body.owner)

        if (!User) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const newDeck = new Deck(req.value.body)
        newDeck.owner = owner._id
        await newDeck.save()

        owner.decks.push(newDeck._id)
        owner.save()

        return res.status(201).json({
            message: 'Deck saved successfully',
            deck: newDeck
        })
    } catch (error) {
        next(error)
    }
}

const getDeck = async (req, res, next) => {
    try {
        const { deckId } = req.value.params
        const deck = await Deck.findById(deckId)
        return res.status(200).json({deck})
    } catch (error) {
        next(error)
    }
}

const replaceDeck = async (req, res, next) => {
    try {
        const { deckId } = req.value.params
        const newDeck = new Deck(req.value.body)

        // check user.owner exist
        const resultFindOwner = await User.findById(newDeck.owner)
        if (!resultFindOwner) {
            return res.status(404).json({
                message: 'Owner not found'
            })
        }

        // remove all user is owner of this deck
        const allUser = await User.find({})
        for (let i = 0; i < allUser.length; i++) {
            if (allUser[i].decks.includes(deckId)) {
                allUser[i].decks.remove(deckId)
                allUser[i].save()
            } else {
                continue
            }
        }

        resultFindOwner.decks.push(deckId)
        resultFindOwner.save()

        const result = await Deck.findByIdAndUpdate(deckId, req.value.body)
        return res.status(200).json({success: true, result: result})
    } catch (error) {
        next(error)
    }
}

const updateDeck = async (req, res, next) => {
    try {
        const { deckId } = req.value.params
        const newDeck = req.value.body

        if (newDeck.owner) {
            const resultFindOwner = await User.findById(newDeck.owner)
            if (!resultFindOwner) {
                return res.status(404).json({
                    message: 'Owner not found'
                })
            }

            // remove all user is owner of this deck
            const allUser = await User.find({})
            for (let i = 0; i < allUser.length; i++) {
                if (allUser[i].decks.includes(deckId)) {
                    allUser[i].decks.remove(deckId)
                    allUser[i].save()
                } else {
                    continue
                }
            }
            
            resultFindOwner.decks.push(deckId)
            resultFindOwner.save()
        }

        const result = await Deck.findByIdAndUpdate(deckId, newDeck)
        return res.status(200).json({success: true, result: result})
    } catch (error) {
        next(error)
    } 
}

module.exports = {
    getAll: getAll,
    newDeck: newDeck,
    getDeck: getDeck,
    replaceDeck: replaceDeck,
    updateDeck: updateDeck
}