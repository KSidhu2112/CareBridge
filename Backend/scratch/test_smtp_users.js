import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function testConfig(user, pass) {
    console.log(`\nTesting with User: ${user}`);
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
            user: user,
            pass: pass
        },
        connectionTimeout: 5000
    });

    try {
        await transporter.verify();
        console.log(`✅ Success for ${user}!`);
        return true;
    } catch (error) {
        console.error(`❌ Failed for ${user}:`, error.message);
        return false;
    }
}

async function runTests() {
    const pass = process.env.SNTP_PASS;
    await testConfig(process.env.SNTP_USER, pass);
    await testConfig(process.env.SENDER_EMAIL, pass);
}

runTests();
