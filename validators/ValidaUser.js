const Joi = require('@hapi/joi')

const schema = Joi.object({

    name: Joi.string().required(),
    email: Joi.string().email().required(),
    username: Joi.string().alphanum().required().min(3).max(20),
    password: Joi.string()
        .pattern(new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$'))
        .required()

})

module.exports = { schema }