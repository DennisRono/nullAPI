const express = require("express")
const router = express.Router()
const db = require("../includes/contact")
const { contactDataSchema } = require("../schemas/contact")

router.post('/contact', async (req, res) => {
    try {
        const validate = await contactDataSchema.validateAsync(req.body)
        let messageid = (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2)
        try {
            let mobj = { name: validate.name, email: validate.email, phone: validate.phone, website: validate.website, brief: validate.brief, assets: validate.assets, messageid: messageid }
            db.create(mobj)
            res.json({status: 200, type: "success", message: "Message sent successfully!"})
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