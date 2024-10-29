const nodemailer = require('nodemailer');
process.env.NODE_ENV = process.env.NODE_ENV || "local";
const config = require("../config.js").get(process.env.NODE_ENV);

const sendEmail = async (to, template) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: config.EMAIL.user,
      pass: config.EMAIL.password,
    },
  });

  const mailOptions = {
    from: config.EMAIL.user,
    to: to,
    subject: "OTP Email",
    html: template,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
  } catch (error) {
    console.error('Error sending email: ', error.message);
  }
};

module.exports = { sendEmail };
