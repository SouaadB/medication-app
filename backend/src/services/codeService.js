const axios = require('axios');

class CodeService {

  /**
   * Génère un code à 6 chiffres
   */
  generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Envoie un code par email
   */
  async sendCodeByEmail(email, code) {
    try {
        console.log(`📧 [ENVOI RÉEL] Email à ${email}: Code ${code}`);
        
        const mailOptions = {
            from: `"MediCare" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '🔐 Code de réinitialisation - MediCare', // ← Change le sujet
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #007AFF; border-radius: 10px;">
                    <div style="text-align: center;">
                        <h1 style="color: #007AFF;">MediCare</h1>
                        <div style="font-size: 48px; margin: 20px 0;">💊</div>
                        <h2 style="color: #333;">Code de réinitialisation</h2>
                        <p style="font-size: 16px; color: #666;">Votre code de vérification est :</p>
                        <div style="background-color: #007AFF; color: white; font-size: 36px; font-weight: bold; padding: 20px; border-radius: 8px; margin: 20px 0; letter-spacing: 5px;">
                            ${code}
                        </div>
                        <p style="font-size: 14px; color: #999;">Ce code expirera dans 15 minutes.</p>
                        <p style="font-size: 14px; color: #999; margin-top: 30px;">
                            Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.<br>
                            L'équipe MediCare
                        </p>
                    </div>
                </div>
            `
        };

        await axios.post('https://api.brevo.com/v3/smtp/email', {
            sender: { name: 'MediCare', email: process.env.EMAIL_USER },
            to: [{ email: email }],
            subject: mailOptions.subject,
            htmlContent: mailOptions.html,
        }, {
            headers: {
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json',
            }
        });
        console.log(`✅ Email envoyé via Brevo`);
        return { success: true };
    } catch (error) {
        console.error('❌ Erreur envoi email:', error);
        return { success: false, error: error.message };
    }
}

  /**
   * Simule l'envoi par SMS (affiche dans la console)
   */
  async sendCodeBySMS(phone, code) {
    console.log(`📱 [SIMULATION] SMS envoyé au ${phone}: Code ${code}`);
    return { success: true };
  }
}

module.exports = new CodeService();