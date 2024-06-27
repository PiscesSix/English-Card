const express = require('express')
const router = express.Router()

const DeckController = require('../controllers/deck')

const { validateBody, validateParam, schemas } = require('../helpers/routeHelpers')

router.route('/')
    .get(DeckController.getAll)
    .post(validateBody(schemas.newDeckSchema), DeckController.newDeck)

router.route('/:deckId')
    .get(validateParam(schemas.idSchema,'deckId'), DeckController.getDeck)
    .put(validateParam(schemas.idSchema,'deckId'), validateBody(schemas.deckSchema), DeckController.replaceDeck)
    .patch(validateParam(schemas.idSchema,'deckId'), validateBody(schemas.deckOptionalSchema), DeckController.updateDeck)
    
module.exports = router