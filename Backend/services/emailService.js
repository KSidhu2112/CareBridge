import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter = null;

const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            port: process.env.SMTP_PORT || 587,
            secure: false, 
            auth: {
                user: process.env.SMTP_USER?.trim(),
                pass: process.env.SMTP_PASS?.trim()
            }
        });
    }
    return transporter;
};

export const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: `"CareBridge" <${process.env.SENDER_EMAIL}>`,
        to: email,
        subject: 'Your Verification Code',
        // ... (html remains same)
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px;">
                <h2 style="color: #333; text-align: center;">Welcome to CareBridge</h2>
                <p style="font-size: 16px; color: #555;">Hello,</p>
                <p style="font-size: 16px; color: #555;">Thank you for signing up. Please use the following One-Time Password (OTP) to complete your registration:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #007bff; background: #f0f7ff; padding: 10px 20px; border-radius: 5px; border: 1px dashed #007bff;">
                        ${otp}
                    </span>
                </div>
                <p style="font-size: 14px; color: #888; text-align: center;">This code is valid for 5 minutes. If you did not request this code, please ignore this email.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #aaa; text-align: center;">&copy; 2026 CareBridge. All rights reserved.</p>
            </div>
        `
    };

    try {
        console.log(`Attempting to send OTP to ${email}...`);
        const currentTransporter = getTransporter();
        console.log(`Using SENDER_EMAIL: ${process.env.SENDER_EMAIL}`);
        
        await currentTransporter.sendMail(mailOptions);
        console.log(`OTP sent successfully to ${email}`);
        return { success: true };
    } catch (error) {
        console.error('CRITICAL EMAIL ERROR:', error.message);
        console.error('Error Code:', error.code);
        console.error('SMTP Config used:', {
            host: 'smtp-relay.brevo.com',
            user: process.env.SMTP_USER,
            sender: process.env.SENDER_EMAIL
        });
        return { success: false, error: error.message };
    }
};

