const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // assuming you have a User model
const Mongoose = require('mongoose');
const { generateJWTToken } = require('../utils/commonMethods');
const { sendEmail } = require('../utils/mailer');
process.env.NODE_ENV = process.env.NODE_ENV || "local"; // local
const config = require("../config.js").get(process.env.NODE_ENV);
const FunctoryFunctions = require('../middleware/factoryFunctions');

async function login(req, res) {
    const responseHandler = new FunctoryFunctions(res);

    try {
        const { email, password } = req.body;
        console.log(req.body);

        if (!email || !password) {
            return responseHandler.responseSend(400, 'Email and password are required', null);
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        console.log(user);

        if (!user) {
            return responseHandler.responseSend(401, 'Invalid email or password', null);
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return responseHandler.responseSend(401, 'Invalid email or password', null);
        }

        let payload = {
            userId: user._id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName
        };
        console.log(payload);

        const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: '24h',
        });

        return responseHandler.responseSend(200, "Login Successfully", { token });
    } catch (err) {
        console.error(err);
        return responseHandler.responseSend(500, 'Internal Server Error', null, err.message);
    }
}

async function updateProfilePassword(req, res) {
    const responseHandler = new FunctoryFunctions(res);

    try {
        let { _id, password, confirmPassword } = req.body;
        if (!_id || !password || !confirmPassword) {
            return responseHandler.responseSend(400, 'All fields are required', null);
        }

        if (password !== confirmPassword) {
            return responseHandler.responseSend(400, 'Passwords do not match', null);
        }

        let checkUser = await User.findOne({ _id: Mongoose.Types.ObjectId(_id) });
        if (!checkUser) {
            return responseHandler.responseSend(404, 'User not found', null);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        checkUser.password = hashedPassword;

        let payload = {
            _id: checkUser._id,
            firstName: checkUser.firstName,
            email: checkUser.email,
            role: checkUser.role,
        };

        let generateToken = await generateJWTToken(payload, '24h');
        await User.findOneAndUpdate({ _id: Mongoose.Types.ObjectId(_id) }, { $set: { password: hashedPassword, token: generateToken } }, { new: true });

        return responseHandler.responseSend(200, 'Password updated successfully', { token: generateToken });
    } catch (err) {
        console.error(err);
        return responseHandler.responseSend(500, 'Internal server error', null, err.message);
    }
}

async function forgetPassword(req, res) {
    const responseHandler = new FunctoryFunctions(res);

    try {
        let { email } = req.body;
        let checkUser = await User.findOne({ email: email.toLowerCase() });

        if (!checkUser) {
            return responseHandler.responseSend(404, 'User not found', null);
        }

        let payload = {
            _id: checkUser._id,
            firstName: checkUser.firstName,
            email: checkUser.email,
            role: checkUser.role
        };
        let newHost = 'http://159.203.100.155'

        let generatedPasswordToken = await generateJWTToken(payload, '1h');
        let resetPasswordLink = `${newHost}/reset-password?token=${generatedPasswordToken}`;

        const emailTemplate = `
            <p>Dear ${checkUser.firstName},</p>
            <p>We received a request to reset your password.</p>
            <p>Please click the button below to reset your password:</p>
            <a href="${resetPasswordLink}" style="display: inline-block; 
               padding: 10px 20px; 
               font-size: 16px; 
               color: #ffffff; 
               background-color: #007bff; 
               text-decoration: none; 
               border-radius: 5px;" onclick="window.open('${resetPasswordLink}', '_blank'); return false;">Reset Password</a>
            <p>If you did not request this change, please ignore this email.</p>
            <p>Best regards,</p>
            <p>Your Team</p>
        `;

        await sendEmail(checkUser.email, emailTemplate);
        return responseHandler.responseSend(200, 'Reset password email sent', null);
    } catch (err) {
        console.error('Error in forgetPassword:', err);
        return responseHandler.responseSend(500, 'Internal Server Error', null, err.message);
    }
}

async function resetPassword(req, res) {
    const responseHandler = new FunctoryFunctions(res);

    try {
        let { password, confirmPassword, _id } = req.body;

        if (!password || !confirmPassword) {
            return responseHandler.responseSend(400, 'Password and confirm password are required');
        }

        if (password !== confirmPassword) {
            return responseHandler.responseSend(400, 'Passwords do not match');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await User.findByIdAndUpdate(_id, { password: hashedPassword }, { new: true });

        if (!user) {
            return responseHandler.responseSend(404, 'User not found');
        }

        return responseHandler.responseSend(200, 'Password reset successfully', { userId: user._id });
    } catch (err) {
        console.error(err);
        return responseHandler.responseSend(500, 'Internal Server Error', null, err.message);
    }
}

module.exports = {
    login,
    updateProfilePassword,
    forgetPassword,
    resetPassword
};
