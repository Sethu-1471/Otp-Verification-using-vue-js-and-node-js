const User = require('../models/User')
const Otp = require('../models/otpVerify')
const bcrypt = require('bcryptjs')
const fast2sms = require('fast-two-sms')
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const ttl = require('mongoose-ttl');


const register = async (req, res, next) => {
    try {
        if (!req.body.name || !req.body.phone || !req.body.password || !req.body.otp) {
            res.json({
                status: false,
                message: "Some Fields are unfilled"
            })
        }

        let otpCheck = await Otp.findOne({ phone: req.body.phone });

        if (otpCheck) {
            // To calculate the time difference of two dates 
            var Difference_In_Time = new Date().getTime() - new Date(otpCheck.expire).getTime();
            console.log(Difference_In_Time, new Date().getTime(), new Date(otpCheck.expire).getTime());
            if (Difference_In_Time > 0) {
                let otpUserCheck = await Otp.findOne({ phone: req.body.phone });
                await Otp.deleteOne({ _id: otpUserCheck._id })
                res.json({
                    status: false,
                    message: "OTP Time Expire"
                })
            } else {
                if (otpCheck.otp !== req.body.otp) {
                    let otpUserCheck = await Otp.findOne({ phone: req.body.phone });
                    await Otp.deleteOne({ _id: otpUserCheck._id })
                    res.json({
                        status: false,
                        message: "OTP Invalid"
                    })
                } else {
                    

                    bcrypt.hash(req.body.password ,10 , async (err, hashedPwd) => {
                        if (err) {
                            let otpUserCheck = await Otp.findOne({ phone: req.body.phone });
                            await Otp.deleteOne({ _id: otpUserCheck._id })
                            res.json({
                                status: false,
                                message: "Error while registering", err
                            })
                        }
                
                        if (!req.body.name || !req.body.phone || !hashedPwd) {
                            res.json({
                                status: false,
                                message: "Some Fields are unfilled"
                            })
                        }
                
                    //     var options = {authorization : process.env.API_KEY , message : 'YOUR_MESSAGE_HERadE' ,  numbers : ['8825598814']} 
                    //    await fast2sms.sendMessage(options).then(response=>{
                    //   console.log(response)
                    // })
                        
                    client.messages.create({
                        body: 'Your account is confirmed Name:' + req.body.name +'Username:' + req.body.phone + "Dont share password with others. Created at" + new Date() ,
                        from: '+12058431999',
                        to: "+91" + req.body.phone
                    })
                
                        // New User
                        let newUser = new User({
                            name: req.body.name,
                            phone: req.body.phone,
                            password: hashedPwd,
                        })
                
                
                        try {
                            let userCheck = await User.findOne({ phone: req.body.phone });
                            let otpUserCheck = await Otp.findOne({ phone: req.body.phone });
                            await Otp.deleteOne({ _id: otpUserCheck._id })
                            if (userCheck) {
                                res.json({
                                    status: false,
                                    message: "phone is already registered"
                                })
                            } else {
                                newUser.save().then(user => {
                                    res.json({
                                     status: true,
                                message: "User registered"
                            })
                                }).catch(err => {
                                    let otpUserCheck = Otp.findOne({ phone: req.body.phone });
                                    Otp.deleteOne({ _id: otpUserCheck._id })
                            res.json({
                                status: false,
                                message: "Error while registering. Try again", err
                            })
                        })
                            }
                        } catch (err) {
                            let otpUserCheck = await Otp.findOne({ phone: req.body.phone });
                            await Otp.deleteOne({ _id: otpUserCheck._id })
                            res.json({
                                status: false,
                                message: "Error while registering. Try again", err
                            })
                        }
                    })


                }   
            }
        } else {
            res.json({
                status: false,
                message: "Phone number not registered"
            })
        }
    } catch (err) {
        console.log(err.message);
    }
}



//otp
const otpVerify = async (req, res, next) => {
    try {
    if (!req.body.name || !req.body.phone || !req.body.password) {
        res.json({
            status: false,
            message: "Some Fields are unfilled"
        })
        }
        
        if (req.body.phone) {
            
            let userCheck = await User.findOne({ phone: req.body.phone });
            if (userCheck) {
                res.json({
                    status: false,
                    message: "phone is already registered"
                })
            } else {

                let otp = ""
                let otpUserCheck = await Otp.findOne({ phone: req.body.phone });
                if (otpUserCheck) {
                     // To calculate the time difference of two dates 
                    var Difference_In_Time = new Date().getTime() - new Date(otpUserCheck.expire).getTime();
                    if (Difference_In_Time < 0) {
                        otp = otpUserCheck.otp   
                    } else {
                        await Otp.deleteOne({ _id: otpUserCheck._id })
                        otpUserCheck = false
                        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for( let i = 0; i < 5; ++i){
                let at = Math.floor(Math.random() * (charset.length + 1) )
                otp += charset.charAt(at)
                    }
                    }
                } else {
                    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for( let i = 0; i < 5; ++i){
                let at = Math.floor(Math.random() * (charset.length + 1) )
                otp += charset.charAt(at)
                    }
                }

                let sendSms = async() => {
                    client.messages.create({
                        body: 'Your confirmation otp for '+ req.body.name +' account is ' + otp ,
                        from: '+12058431999',
                        to: "+91" + req.body.phone
                    }).then(res => {
                        return res;
                      })
                }

                let newOtp = new Otp({
                    phone: req.body.phone,
                    otp: otp,
                    expire: new Date(new Date().getTime() + 3 * 60000),
                    create: new Date()
                })
                if (!otpUserCheck) {
                    newOtp.save().then(re => {
                        sendSms()
                        res.json({
                            status: true,
                            message: "Otp send to" + req.body.phone +"mobile number"
                        })  
                    }).catch(err => {
                        res.json({
                            status: false,
                            message: err,message
                        })
                    })
                    
                } else {
                    sendSms()
                    res.json({
                        status: true,
                        message: "Otp send to" + req.body.phone +"mobile number"
                    })  
                }

                // then(message => console.log(message.sid));
                // await fast2sms.sendMessage(options).
                // var options = { authorization: process.env.API_KEY, message: 'Your confirmation otp is - ' + otp, numbers: ['8825598814'] }
//                 client.messages.create({
//      body: 'Your confirmation otp for '+ req.body.name +' account is ' + otp ,
//      from: '+12058431999',
//      to: "+91" + req.body.phone
//    })
//   .then(response => {
//       console.log("response", response.status);
     
//                     let newOtp = new Otp({
//                         phone: req.body.phone,
//                         otp: otp,
//                         expire: new Date(new Date().getTime() + 1 * 60000),
//                         create: new Date()
//                     })
                   
//                     if (!otpUserCheck) {
//                         newOtp.save().then(re => {
//                             res.json({
//                                 status: true,
//                                 message: "Otp send to" + req.body.phone +"mobile number"
//                             })  
//                         }).catch(err => {
//                             res.json({
//                                 status: false,
//                                 message: err,message
//                             })
//                         })
                        
//                     } else {
//                         res.json({
//                             status: true,
//                             message: "Otp send to" + req.body.phone +"mobile number"
//                         })  
//                     }
                   
//   }).catch(err => {
//     res.json({
//         status: false,
//         message: err.message
//     })
//                 })
                
            }

        }
    } catch (err) {
        res.json({
            status: false,
            message: "error" + err.message
        })
    }
}

module.exports = { register, otpVerify }