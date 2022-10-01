let whitelist = ['http://localhost:3000']

let options = {
    origin: (origin, callback) => {
        (whitelist.indexOf(origin) !== -1)?callback(null, true):callback('Not allowed by CORS')
    }
}