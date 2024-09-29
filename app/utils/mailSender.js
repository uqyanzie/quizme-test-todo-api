const nodemailer = require('nodemailer');

const mailSender = async (email, subject, text, html) => {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
        });

        let info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: subject,
            text: text,
            html: html
        });

        console.log("Message sent: %s", info.messageId);

        return info;
    }
    catch (err) {
        console.log("error sending email : ", err);
    }
    
}

module.exports = mailSender;