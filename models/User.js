const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const Schema = mongoose.Schema

const userSchema = new Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    decks: [{
        type: Schema.Types.ObjectId,
        ref: 'Deck'
    }]
})

userSchema.pre('save', async function(next) {
    try {
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(this.password, salt)
        this.password = passwordHash
        next()
    } catch (error) {
        next(error)
    }
})

userSchema.methods.isValidPassword = async function(newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.password)
    } catch (error) {
        throw new Error(error)
    }
}

const User = mongoose.model('User', userSchema)
module.exports = User