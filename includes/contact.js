const conn = require("../db/conn")

//fetch all records
let blogodb = {}

//create a new record
blogodb.create = (data) => {
return new Promise((resolve, reject)=>{
    conn.query('INSERT INTO contact(Name, Email, Phone, Website, Brief, Assets, MessageID) VALUES(?,?,?,?,?,?,?)', [ data.name, data.email, data.phone, data.website, data.brief, data.assets, data.messageid ], (err, results)=>{
        if(err){return reject(err)}
        return resolve(results)
    })
})
}

module.exports = blogodb