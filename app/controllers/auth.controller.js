const config = require("../config/auth.config");
const { User, OTP } = require("../models");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .required(),

    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,30}$'))
        .required()
        .messages({
            'string.pattern.base': 'Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one symbol'
        }),

    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': "Password confirmation doesn't match",
    }),

    otp: Joi.string()
        .required()
        .length(6)
});

const authSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .required()
});

const register = async (req, res) => {

    try {
        
        const { error, value } = registerSchema.validate(req.body);        

        if (error) {
            res.status(400).json({ message: error.details[0].message, success: false });
            return;
        }

        if (await User.findOne({ email : value.email })) {
            return res.status(400).json({ success: false, message: "Email is already registered!" });
        }

        const response = await OTP.find({ email: value.email }).limit(1);

        if (response.length === 0 || value.otp !== response[0].otp) {
            return res.status(400).json({ 
                success: false, 
                message: "OTP is invalid!" 
            });
        }

        const user = new User({
            username: value.username,
            email: value.email,
            password: bcrypt.hashSync(value.password, 8)
        });

        await user.save()

        console.log("test user");

        return res.status(200).json({ 
            success: true,
            message: "User was registered successfully!",
            data: user
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            message: err.message || "Some error occurred while creating the User." 
        });
    }
}

const auth = async (req, res) => {
    try {

        const { error, value } = authSchema.validate(req.body);

        if (error) {
            res.status(400).json({ message: error.details[0].message, success: false });
            return;
        }

        const user = await User.findOne({ email: value.email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User Not found." });
        }

        const passwordIsValid = bcrypt.compareSync(
            value.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).json({
                success: false,
                accessToken: null,
                message: "Invalid Credentials!"
            });
        }

        const token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            accessToken: token
        });
    } catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }
    
}

const authController = {
    register,
    auth
};

module.exports = authController;