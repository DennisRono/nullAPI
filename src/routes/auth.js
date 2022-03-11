const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jsonFormat = require('json-format');
require('dotenv').config();
const { registerDataSchema, loginDataSchema, regDataSchema, logDataSchema } = require("../schemas/user");

//json-format config
let config = {
    type: 'space',
    size: 2
}

//register a new user in the system
router.post("/register", async (req, res, next) => {
    try{
        const validate = await registerDataSchema.validateAsync(req.body);
        res.json({"email": validate.email, "pass": validate.password})
    } catch (err){
        if (err.isJoi === true) {
            res.status(422).json(jsonFormat({"status": 422,"type":"Error","message":err.details[0].message}, config));
        } else {
            res.status(500).json(jsonFormat({"status": 422,"type":"Error","message":err}, config));
        }
    }
})

module.exports = router;