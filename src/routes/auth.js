const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require('dotenv').config();
const { registerDataSchema, loginDataSchema, regDataSchema, logDataSchema } = require("../schemas/user");

//register a new user in the system
router.post("/register", async (req, res, next) => {
    try{
        const validate = await registerDataSchema.validateAsync(req.body);
        res.json({"email": validate.email, "pass": validate.password})
    } catch (err){
        if (err.isJoi === true) {
            res.status(422).json(err.details[0].message);
        } else {
            res.status(500).json(err);
        }
    }
})

module.exports = router;