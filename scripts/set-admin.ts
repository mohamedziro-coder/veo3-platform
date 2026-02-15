import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

function loadEnv() {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf-8');
        content.split('\n').forEach(line => {
            const [key, ...values] = line.split('=');
            if (key && values.length > 0) {
                const val = values.join('=').trim().replace(/^["'](.*)["']$/, '$1');
                if (!process.env[key.trim()]) {
                    process.env[key.trim()] = val;
                }
            }
        });
    }
}

async function main() {
    loadEnv();
    const email = process.argv[2];

    if (!email) {
        console.error("Please provide an email: npx tsx scripts/set-admin.ts <email>");
        process.exit(1);
    }

    if (!process.env.POSTGRES_URL) {
        console.error("POSTGRES_URL missing");
        process.exit(1);
    }

    try {
        const sql = neon(process.env.POSTGRES_URL);
        console.log(` promoting ${email} to admin...`);

        const result = await sql`
            UPDATE users 
            SET role = 'admin' 
            WHERE LOWER(email) = ${email.toLowerCase()}
            RETURNING id, email, role
        `;

        if (result.length === 0) {
            console.error("User not found!");
        } else {
            console.log("Success:", result[0]);
        }
    } catch (error) {
        console.error("Failed:", error);
    }
}

main();
