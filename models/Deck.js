const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

const Deck = mongoose.model('Deck', deckSchema);
module.exports = Deck;