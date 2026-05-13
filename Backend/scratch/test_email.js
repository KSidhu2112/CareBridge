import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('Testing SMTP configuration...');
console.log('Host: smtp-relay.brevo.com');
console.log('Port:', process.env.SMTP_PORT);
console.log('User:', process.env.SMTP_USER);
console.log('Sender:', process.env.SENDER_EMAIL);

async function runTest(user, pass, port, secure, label) {
    console.log(`\nTesting with ${label} (Port: ${port}, Secure: ${secure}): ${user}`);
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: port,
        secure: secure,
        auth: {
            user: user?.trim(),
            pass: pass?.trim()
        },
        connectionTimeout: 5000
    });

    try {
        await transporter.verify();
        console.log(`✅ Success for ${label}!`);
        return true;
    } catch (error) {
        console.error(`❌ Failed for ${label}:`, error.message);
        return false;
    }
}

async function start() {
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const sender = process.env.SENDER_EMAIL;

    await runTest(user, pass, 587, false, 'Configured SMTP_USER (587)');
    await runTest(sender, pass, 587, false, 'SENDER_EMAIL as SMTP_USER (587)');
    await runTest(user, pass, 465, true, 'Configured SMTP_USER (465)');
    await runTest(sender, pass, 465, true, 'SENDER_EMAIL as SMTP_USER (465)');
}


start();

