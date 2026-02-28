const nodemailer = require('nodemailer');

class CodeService {
  constructor() {
    // Configuration email
    this.emailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

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
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Code de réinitialisation - Medication App',
        html: `
          <h2>Réinitialisation de mot de passe</h2>
          <p>Votre code de vérification est :</p>
          <h1 style="font-size: 32px; color: #4CAF50;">${code}</h1>
          <p>Ce code expirera dans 15 minutes.</p>
        `
      };

      await this.emailTransporter.sendMail(mailOptions);
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