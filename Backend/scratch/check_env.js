import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('SMTP_USER length:', process.env.SMTP_USER ? process.env.SMTP_USER.length : 'undefined');
console.log('SMTP_PASS length:', process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 'undefined');
console.log('SENDER_EMAIL length:', process.env.SENDER_EMAIL ? process.env.SENDER_EMAIL.length : 'undefined');

