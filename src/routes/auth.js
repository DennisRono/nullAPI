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
            if (user) {return res.status(400).json({"status": 422,"type":"Error","message":"user is already registered!"});}
            else{
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) {return res.status(422).send(err.message);}
                    bcrypt.hash(validate.password, salt, (err, hash) => {
                        if (err) {return res.status(422).send(err.message);}
                        let userid = (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2);
                        try {
                            let uobj = { "email": validate.email, "password": hash, "phone": validate.phone, "userID": userID }
                            db.create(uobj);
                            res.json(uobj);
                        } catch (err) { res.status(500).json({"status": 422,"type":"Error","message":err}); }
                    })
                })
            }
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