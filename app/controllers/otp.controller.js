const otpGenerator = require('otp-generator');
const {OTP, User} = require('../models');

const sendOTP = async (req, res) => {
    try {
        const {email} = req.body;
        
        const checkUserPresent = await User.findOne({email});

        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        let otp = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        let result = await OTP.findOne({otp: otp});

        while (result) {
            otp = otpGenerator.generate(6, {
                digits: true,
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });
            result = await OTP.findOne({otp: otp});
        }

        const otpPayload = { email, otp };
        const otpBody = await OTP.create(otpPayload);

        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            otpBody
        });
        
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const otpController = {
    sendOTP
};

module.exports = otpController;
