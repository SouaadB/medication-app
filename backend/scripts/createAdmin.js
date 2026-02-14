require('dotenv').config();

// Import the function
const createDefaultAdmin = require('../src/config/createDefaultAdmin');

console.log('🚀 Starting default admin creation...');
console.log('==================================');

// Wrap in an async function to handle the await properly
async function run() {
    try {
        const result = await createDefaultAdmin();
        console.log('==================================');
        if (result && result.success) {
            console.log('✅ Admin setup complete!');
        } else {
            console.log('❌ Admin setup failed!');
        }
        process.exit(0);
    } catch (error) {
        console.error('❌ Unexpected error:', error);
        process.exit(1);
    }
}

// Call the function
run();