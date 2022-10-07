const express = require("express")
const router = express.Router()
const db = require("../includes/contact")
const { contactDataSchema } = require("../schemas/contact")
const { sendEmail } = require("../includes/mailer")

router.post('/contact', async (req, res) => {
    try {
        const validate = await contactDataSchema.validateAsync(req.body)
        let messageid = (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2)
        try {
            let mobj = { name: validate.name, email: validate.email, phone: validate.phone, website: validate.website, brief: validate.brief, assets: validate.assets, messageid: messageid }
            db.create(mobj, (message, r) => {
                //send mail to denniskibet
                sendEmail("Testing", "testing local mailer", "bennkaiser1@gmail.com", "denniski@denniskibet.com", "admin@denniskibet.com")
                res.json({status: 200, type: "success", message: message, response: r})
            })
        } catch (err) { res.json({"status": 500,"type":"Error","details":err}) }
    } catch (err) {
        if (err.isJoi === true) {
            res.json({"status": 400,"type":"Error","message":err.details[0].message})
        } else {
            res.json({"status": 500,"type":"Error","details":err})
        }
    }
})

module.exports = router