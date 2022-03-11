const express = require("express");
const router = express.Router();
const db = require("../includes/auth");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { registerDataSchema, loginDataSchema, regDataSchema, logDataSchema } = require("../schemas/user");


//register a new user in the system
router.post("/register", async (req, res, next) => {
    try{
        const validate = await registerDataSchema.validateAsync(req.body);
        await db.one(validate.email).then((user) => {
            if (user) return res.status(400).json({"status": 422,"type":"Error","message":"user is already registered!"});
            res.json(validate)
        })
    } catch (err){
        if (err.isJoi === true) {
            res.status(422).json({"status": 422,"type":"Error","message":err.details[0].message});
        } else {
            res.status(500).json({"status": 422,"type":"Error","message":err});
        }
    }
})

module.exports = router;