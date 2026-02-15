const fs = require('fs');
const path = require('path');

// Patterns relative to repo root that we consider "garbage" files
const patterns = [
  /^debug_.*\.(txt|js)$/i,
  /^test_output.*\.txt$/i,
  /^models_list\.(txt|json)$/i,
  /^.*\.log$/i // some generic log files
];

const root = path.resolve(__dirname, '..');
const destDir = path.join(root, 'logs');
const args = process.argv.slice(2);
const shouldDelete = args.includes('--delete');

function matches(filename) {
  return patterns.some((rx) => rx.test(filename));
}

(async function cleanup() {
  try {
    if (!fs.existsSync(destDir) && !shouldDelete) {
      fs.mkdirSync(destDir);
      console.log('📁 Created logs/ directory');
    }

    const entries = fs.readdirSync(root);
    for (const name of entries) {
      const file = path.join(root, name);
      const stat = fs.statSync(file);
      if (stat.isFile() && matches(name)) {
        if (shouldDelete) {
          fs.unlinkSync(file);
          console.log(`🗑  Deleted ${name}`);
        } else {
          const target = path.join(destDir, name);
          fs.renameSync(file, target);
          console.log(`🚚 Moved ${name} -> logs/${name}`);
        }
      }
    }
    console.log('✅ Cleanup finished');
    console.log(`   run with --delete if you want to remove files instead of moving them`);
  } catch (err) {
    console.error('❌ Cleanup error:', err);
  }
})();
