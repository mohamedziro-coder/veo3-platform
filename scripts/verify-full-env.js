const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const CONFIG_PATH = path.join(process.cwd(), 'src', 'data', 'config.json');

console.log('--- Environment Verification ---');

// Load config.json if exists
let jsonConfig = {};
try {
    if (fs.existsSync(CONFIG_PATH)) {
        jsonConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
        console.log('✅ Loaded src/data/config.json');
    } else {
        console.log('⚠️ src/data/config.json not found');
    }
} catch (e) {
    console.error('❌ Error reading config.json:', e.message);
}

// Helper to check var
function check(name, required = true) {
    const fromEnv = process.env[name];
    const fromJson = jsonConfig[name];
    const val = fromJson || fromEnv;
    
    if (val) {
        // Mask value
        const masked = val.length > 8 ? val.substring(0, 4) + '...' + val.substring(val.length - 4) : '****';
        console.log(`✅ ${name}: Found (${masked}) [Source: ${fromJson ? 'JSON' : 'ENV'}]`);
        return true;
    } else {
        if (required) {
            console.error(`❌ ${name}: MISSING (Required)`);
        } else {
            console.warn(`⚠️ ${name}: Missing (Optional)`);
        }
        return false;
    }
}

// Check Required Vars
const required = [
    'GEMINI_API_KEY',
    'GOOGLE_PROJECT_ID', 
    'GOOGLE_LOCATION', 
    'GOOGLE_APPLICATION_CREDENTIALS_JSON', 
    'GCS_BUCKET_NAME',
    'POSTGRES_URL'
];

let missingCount = 0;
for (const v of required) {
    if (!check(v)) missingCount++;
}

console.log('\n--- Summary ---');
if (missingCount > 0) {
    console.error(`❌ Critical: ${missingCount} required environment variables are missing.`);
    console.log('Action: Please add them to .env.local or src/data/config.json');
    process.exit(1);
} else {
    console.log('✅ All checks passed. Environment is ready.');
    process.exit(0);
}
