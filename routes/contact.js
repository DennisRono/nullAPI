const express = require("express")
const router = express.Router()
const db = require("../includes/contact")
const path = require('path')
const { contactDataSchema } = require("../schemas/contact")
const { sendEmail } = require("../includes/mailer")
const multer = require('multer')

//image upload dest
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + file.originalname.match(/\..*$/)[0]);
    }
})

const upload = multer({ storage: storage })

router.post('/contact', upload.array('assets', 10), async (req, res) => {
    try {
        console.log(req.files);
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
            console.log(err.details);
            res.json({"status": 400,"type":"Error","message":err.details[0].message})
        } else {
            res.json({"status": 500,"type":"Error","details":err})
        }
    }
})

module.exports = router