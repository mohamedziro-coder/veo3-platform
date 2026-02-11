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

        // Find credentials JSON block (multiline or single line)
        // We look for GOOGLE_APPLICATION_CREDENTIALS_JSON='{...}'
        const credsMatch = envContent.match(/GOOGLE_APPLICATION_CREDENTIALS_JSON='([\s\S]*?)'/);
        if (credsMatch) {
            try {
                creds = JSON.parse(credsMatch[1]);
            } catch (e) {
                console.error('Failed to parse credentials from env:', e.message);
            }
        } else {
            // Try without quotes
            const credsMatch2 = envContent.match(/GOOGLE_APPLICATION_CREDENTIALS_JSON=({[\s\S]*?})/);
            if (credsMatch2) {
                try {
                    creds = JSON.parse(credsMatch2[1]);
                } catch (e) { }
            }
        }

        const bucketMatch = envContent.match(/GCS_BUCKET_NAME=(.*)/);
        if (bucketMatch) bucketName = bucketMatch[1].trim();
    }

    if (!bucketName) {
        console.error('❌ No bucket name found in .env.local');
        return;
    }

    console.log(`Bucket: ${bucketName}`);

    if (!creds.project_id) {
        console.error('❌ No credentials found.');
        return;
    }

    const storage = new Storage({ credentials: creds });

    try {
        const [files] = await storage.bucket(bucketName).getFiles({ maxResults: 50 });
        console.log(`Found ${files.length} total files. Listing latest 10:`);

        // Sort by timeCreated desc
        files.sort((a, b) => new Date(b.metadata.timeCreated) - new Date(a.metadata.timeCreated));

        files.slice(0, 10).forEach(file => {
            console.log(`- ${file.name} (${file.metadata.size} bytes) [${file.metadata.timeCreated}]`);
        });
    } catch (e) {
        console.error('❌ Error listing files:', e.message);
    }
}

listBucket();
