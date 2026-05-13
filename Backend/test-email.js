import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, 
    auth: {
        user: process.env.SMTP_USER?.trim(),
        pass: process.env.SMTP_PASS?.trim()
    }
});

const mailOptions = {
    from: `"CareBridge" <${process.env.SENDER_EMAIL}>`,
    to: "test@example.com",
    subject: 'Test Email',
    text: "Test"
};

transporter.sendMail(mailOptions)
    .then(() => console.log("Success"))
    .catch(err => console.error("Error:", err));
