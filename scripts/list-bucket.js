const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');

async function listBucket() {
    console.log('Listing bucket contents...');

    // Load config manually
    const envPath = path.join(__dirname, '..', '.env.local');
    let creds = {};
    let bucketName = '';

    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');

        // Better regex for multiline JSON
        const credsMatch = envContent.match(/GOOGLE_APPLICATION_CREDENTIALS_JSON='([\s\S]*?)'/);
        if (credsMatch) {
            try {
                creds = JSON.parse(credsMatch[1]);
            } catch (e) {
                console.error('Failed to parse credentials from env:', e.message);
            }
        }

        const bucketMatch = envContent.match(/GCS_BUCKET_NAME=(.*)/);
        if (bucketMatch) bucketName = bucketMatch[1].trim();
    }

    if (!bucketName) {
        // Fallback to config.json
        const configPath = path.join(__dirname, '..', 'src', 'data', 'config.json');
        if (fs.existsSync(configPath)) {
            try {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
                bucketName = config.GCS_BUCKET_NAME;
                // Only if not found in env
                if (!creds.project_id && config.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
                    creds = JSON.parse(config.GOOGLE_APPLICATION_CREDENTIALS_JSON);
                }
            } catch (e) { }
        }
    }

    if (!bucketName) {
        console.error('❌ No bucket name found in .env.local or config.json');
        return;
    }

    console.log(`Bucket: ${bucketName}`);

    if (!creds.project_id) {
        console.error('❌ No credentials found.');
        return;
    }

    const storage = new Storage({ credentials: creds });

    try {
        const [files] = await storage.bucket(bucketName).getFiles({ prefix: 'veo-outputs/' });
        console.log(`Found ${files.length} files in veo-outputs/:`);
        files.forEach(file => {
            console.log(`- ${file.name} (${file.metadata.size} bytes) [${file.metadata.timeCreated}]`);
        });
    } catch (e) {
        console.error('❌ Error listing files:', e.message);
    }
}

listBucket();
