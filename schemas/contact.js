const Joi = require('@hapi/joi');

const contactDataSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().lowercase().required(),
    phone: Joi.string().min(10).max(10).required(),
    website: Joi.string().required(),
    brief: Joi.string().required(),
    assets: Joi.string(),
});

module.exports = { contactDataSchema };