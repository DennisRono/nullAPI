const express = require("express");
const router = express.Router();
const db = require("../includes/auth");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { registerDataSchema, loginDataSchema } = require("../schemas/user");


//register a new user in the system
router.post("/register", async (req, res, next) => {
    try{
        const validate = await registerDataSchema.validateAsync(req.body);
        await db.one(validate.email).then((user) => {
            if (user) {return res.status(400).json({"status": 400,"type":"Error","message":"user is already registered!"});}
            else{
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) {return res.status(422).send(err.message);}
                    bcrypt.hash(validate.password, salt, (err, hash) => {
                        if (err) {return res.status(422).send(err.message);}
                        let userid = (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2);
                        try {
                            let uobj = { "email": validate.email, "password": hash, "phone": validate.phone, "userID": userid }
                            db.create(uobj);
                            res.json(uobj);
                        } catch (err) { res.status(500).json({"status": 500,"type":"Error","details":err}); }
                    })
                })
            }
        })
    } catch (err){
        if (err.isJoi === true) {
            res.status(400).json({"status": 400,"type":"Error","message":err.details[0].message});
        } else {
            res.status(500).json({"status": 500,"type":"Error","details":err});
        }
    }
})

//login a user to the system
router.post("/login", async (req, res, next) => {
    const validate = await loginDataSchema.validateAsync(req.body);
    await db.one(validate.email).then((user) => {
        if (!user) return res.status(400).json({"status": 400,"type":"Error","message":"user is not registered!"});
        bcrypt.compare(req.body.password, user.Password, function(err, result) {
            if (err) {return res.status(422).send({ "wrong password!": err });}
            if (result) {
                const token = jwt.sign({ data: user.UserID }, process.env.TOKEN_SECRET, { expiresIn: '15m' });
                const refreshToken = jwt.sign({ data: user.UserID }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1h' });
                return res.set({ 'auth-token': token, 'refreshToken': refreshToken }).json({ 'auth-token': token, 'refresh-token': refreshToken });
            } else {
                return res.status(400).json({"status": 400,"type":"Error","success":"false","message":"Wrong password!"});
            }
        })
    })
})

//jwt token issue
router.get('/token', async(req, res, next) => {
    try {
        const verified = jwt.verify(req.body.refreshToken, process.env.REFRESH_TOKEN_SECRET);
        await db.one("", verified.data).then((user) => {
            if (!user) return res.status(400).json({ msg: "User not registered" });
            const token = jwt.sign({ data: user.UserID }, process.env.TOKEN_SECRET, { expiresIn: '15m' });
            res.header('auth-token', token).json({ 'auth-token': token });
        });
        next()
    } catch (error) {
        res.status(400).json({"status": 400,"type":"Error","success":"false","message":"invalid refresh token","details":error});
    }
});

module.exports = router;