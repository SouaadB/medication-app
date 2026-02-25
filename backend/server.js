const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error) {
    console.log('⚠️  Error loading .env file:', result.error.message);
}

const app = require('./src/app');

const PORT = process.env.PORT || 5000;

// ⚠️ IMPORTANT: Ajoute '0.0.0.0' pour écouter sur toutes les interfaces
app.listen(PORT, '0.0.0.0', () => {
    console.log('=================================');
    console.log(`🚀 Server is running!`);
    console.log(`📝 Local: http://localhost:${PORT}`);
    console.log(`📱 Network: http://${getLocalIP()}:${PORT}`);
    console.log('=================================');
});

// Ajoute cette fonction à la fin du fichier
function getLocalIP() {
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Vérifie que c'est une IPv4 et pas une interface interne
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return 'localhost';
}