const moongose = require('mongoose')

const OtpSchema = new moongose.Schema({
    phone: {
        type: String,
    },
    otp: {
        type: String,
    },
    expire: { type: String },
    create: { type: String }
})



module.exports = moongose.model('Otp',OtpSchema)