const moongose = require('mongoose')

const UseSchema = new moongose.Schema({
    name: {
        type: String,
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
    },
}, {timestamps: true} )

module.exports = moongose.model('User', UseSchema)