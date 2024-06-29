const Joi = require('@hapi/joi')

const validateBody = (schema) => {
    return (req, res, next) => {
        const validatorResult = schema.validate(req.body)
        if (validatorResult.error) {
            return res.status(400).json(validatorResult.error)
        } else {
            if (!req.value) {
                req.value = {}
            }
            if (!req.value.params) {
                req.value.params = {}
            }
            req.value.body = validatorResult.value
            next()
        }
    }
}

const validateParam = (schema, name) => {
    return (req, res, next) => {
        const validatorResult = schema.validate({ param: req.params[name] })
        if (validatorResult.error) {
            return res.status(400).json(validatorResult.error)
        } else {
            if (!req.value) {
                req.value = {}
            }
            if (!req.value.params) {
                req.value.params = {}
            }
            req.value.params[name] = validatorResult.value.param
            next()
        }
    }
}

const schemas = {
    authSignUpSchema: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required()
    }),

    authSignInSchema: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),
    
    idSchema: Joi.object().keys({
        param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),

    newDeckSchema: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        owner: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),

    userSchema: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required()
    }),

    deckSchema: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        owner: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
    }),

    userOptionalSchema: Joi.object().keys({
        firstName: Joi.string(),
        lastName: Joi.string(),
        email: Joi.string().email()
    }),

    deckOptionalSchema: Joi.object().keys({
        name: Joi.string(),
        description: Joi.string(),
        owner: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
    })
}

module.exports = {
    validateParam,
    validateBody,
    schemas
}
