const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require('dotenv').config();
const { registerDataSchema, loginDataSchema, regDataSchema, logDataSchema } = require("../schemas/user");

//register a new user in the system
router.post("/register", (req, res, next) => {
    try{
        res.json({"email": req.body.email, "pass": req.body.password})
    } catch (err){
        res.json(err)
    }
})

module.exports = router;