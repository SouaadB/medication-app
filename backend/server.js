const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error) {
    console.log('⚠️  Error loading .env file:', result.error.message);
}

const app = require('./src/app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('=================================');
    console.log(`🚀 Server is running!`);
    console.log(`📝 URL: http://localhost:${PORT}`);
    console.log(`=================================`);
});