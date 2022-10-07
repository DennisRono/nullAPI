const express = require("express")
const router = express.Router()
const db = require("../includes/contact")
const { contactDataSchema } = require("../schemas/contact")
const { sendEmail } = require("../includes/mailer")
const multer = require('multer')

//image upload dest
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })

router.post('/contact', upload.array('profile-files', 12), async (req, res) => {
    try {
        const validate = await contactDataSchema.validateAsync(req.body)
        let messageid = (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2)
        try {
            let mobj = { name: validate.name, email: validate.email, phone: validate.phone, website: validate.website, brief: validate.brief, assets: validate.assets, messageid: messageid }
            db.create(mobj, (message, r) => {
                //send mail to denniskibet
                //sendEmail("New Contact From Portfolio!", "Message from "+validate.name+"<br><br>"+validate.website+"<br><br>"+validate.phone+"<br><br>"+validate.brief, "dennisrkibet@gmail.com", validate.email, validate.email)
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