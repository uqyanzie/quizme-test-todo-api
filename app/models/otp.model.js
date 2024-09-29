const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mailSender = require('../utils/mailSender');

const OTPSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5
    }
});


async function sendOtp(email, otp) {

    const mailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Todo App OTP for Email Verification</title>
    </head>
    <body>
        <h3>Please Confirm your OTP verification</h3>
        <p>Your OTP is: <b>${otp}</b></p>
    </body>
    </html>
    `

    try {
        const mailResponse = await mailSender(email, 
            'Todo App OTP for Email Verification', 
            'Please Confirm your OTP verification',
            mailHTML
        );
        console.log("Email sent successfully: ", mailResponse);
    } catch (err) {
        console.log("Error sending email: ", err);
        throw err;
    }
}

OTPSchema.pre('save', async function(next) {
    console.log("New document saved to database");
   if (this.isNew) {
       try {
           await sendOtp(this.email, this.otp);
       } catch (err) {
           console.log("Error sending OTP: ", err);
           throw err;
       }
   }
    next();
});

const OTP = mongoose.model('otps', OTPSchema);

module.exports = OTP;