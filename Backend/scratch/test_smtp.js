import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function testPort(port, secure) {
    console.log(`\nTesting Port: ${port}, Secure: ${secure}`);
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: port,
        secure: secure,
        auth: {
            user: process.env.SNTP_USER,
            pass: process.env.SNTP_PASS
        },
        connectionTimeout: 5000, // 5 seconds
        greetingTimeout: 5000,
        socketTimeout: 5000
    });

    try {
        await transporter.verify();
        console.log(`✅ Success on Port ${port}!`);
        return true;
    } catch (error) {
        console.error(`❌ Failed on Port ${port}:`, error.message);
        return false;
    }
}

async function runTests() {
    console.log('Starting SMTP Port Tests...');
    await testPort(587, false);
    await testPort(2525, false);
    await testPort(465, true);
    console.log('\nTests completed.');
}

runTests();
