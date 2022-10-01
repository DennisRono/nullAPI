const express = require("express");
const router = express.Router();
const db = require("../includes/auth");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerDataSchema, loginDataSchema } = require("../schemas/user");


//register a new user in the system
router.post("/register", async (req, res, next) => {
    try{
        const validate = await registerDataSchema.validateAsync(req.body);
        await db.one(validate.regno).then((user) => {
            if (user) {return res.json({"status": 400,"type":"Error","message":"user is already registered!"});}
            else{
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) {return res.status(422).send(err.message);}
                    bcrypt.hash(validate.password, salt, (err, hash) => {
                        if (err) {return res.status(422).send(err.message);}
                        let userid = (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2);
                        try {
                            let uobj = { fname: validate.fname, lname: validate.lname, regno: validate.regno, password: hash, phone: validate.phone, year: validate.year, school: validate.school, semester: validate.semester, department: validate.department, userID: userid }
                            db.create(uobj);
                            res.json({status: 200, type: "success", message: "Student registered successfully!"})
                        } catch (err) { res.json({"status": 500,"type":"Error","details":err}); }
                    })
                })
            }
        })
    } catch (err){
        if (err.isJoi === true) {
            res.json({"status": 400,"type":"Error","message":err.details[0].message})
        } else {
            res.json({"status": 500,"type":"Error","details":err})
        }
    }
})

//login a user to the system
router.post("/login", async (req, res, next) => {
    try {
        const validate = await loginDataSchema.validateAsync(req.body);
        await db.one(validate.regno).then((user) => {
            if (!user) return res.json({status: 400, type:"Error", message:"user is not registered!"})
            bcrypt.compare(req.body.password, user.Password, function(err, result) {
                if (err) {return res.send({ type: "Error", message: "wrong password!", details: err })}
                if (result) {
                    const token = jwt.sign({ data: user.UserID }, process.env.TOKEN_SECRET, { expiresIn: '15m' });
                    const refreshToken = jwt.sign({ data: user.UserID }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1h' })
                    return res.set({ authToken: token, 'refreshToken': refreshToken }).json({ type: 'success', message: 'Login successful!!', authToken: token, refreshToken: refreshToken });
                } else {
                    return res.json({status: 400, type: "Error", message: "Wrong password!"})
                }
            })
        })
    } catch (err) {
        if (err.isJoi === true) {
            res.json({status: 400, type: "Error", message: err.details[0].message})
        } else {
            res.json({status: 500, type: "Error", message: "something wrong happened", details: err})
        }
    }
})

router.post('/verifytoken', async (req, res) => {
    try {
        if(!req.body.token){return res.json({type: "Error", message:"Access denied", status: 400})}
        const verified = jwt.verify(req.body.token, process.env.TOKEN_SECRET)
        res.json({verified: verified, message: "success", type: "success", status: 200})
    } catch (error) {
        try {
            const verified = jwt.verify(req.body.refreshToken, process.env.REFRESH_TOKEN_SECRET)
            await db.one('', verified.data).then((user) => {
                if (!user) return res.json({status: 400, type:"Error", message:"user is not registered!"})
                const token = jwt.sign({ data: user.UserID }, process.env.TOKEN_SECRET, { expiresIn: '15m' })
                res.header('authToken', token).json({ verified: verified, status: 200, type: 'success', message: 'successfully fetched new token', authToken: token })
            })
        } catch (error) {
            res.json({status: 400, type:"Error", message:"invalid refresh token", details:error});
        }
    }
})

module.exports = router;