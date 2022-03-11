const Joi = require('@hapi/joi');

const registerDataSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    phone: Joi.string().min(10).max(10).required(),
    password: Joi.string().min(8).required().strict(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().strict()
});

const loginDataSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).required().strict(),
});

const regDataSchema = Joi.object({
    fullname: Joi.string().required(),
    phone: Joi.string().min(10).max(10).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).required().strict(),
    cpassword: Joi.string().valid(Joi.ref('password')).required().strict()
});

const logDataSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).required().strict(),
});

module.exports = { registerDataSchema, loginDataSchema, regDataSchema, logDataSchema };