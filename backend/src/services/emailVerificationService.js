const axios = require('axios');

class EmailVerificationService {
  constructor() {
    this.apiKey = process.env.MAILBOXLAYER_API_KEY;
    this.baseUrl = 'http://apilayer.net/api/check';
    this.isDevMode = process.env.DEV_MODE === 'true';
  }

  /**
   * Vérifie si un email existe réellement
   */
  async verifyEmail(email) {
    // Mode développement : accepte tous les emails (POUR TESTS UNIQUEMENT)
    if (this.isDevMode) {
      console.log('🔧 Mode développement: Vérification désactivée');
      return {
        success: true,
        isValid: true,
        mock: true
      };
    }

    // Mode production : utilise Mailboxlayer
    try {
      console.log(`🔍 Vérification email avec Mailboxlayer: ${email}`);
      
      const response = await axios.get(this.baseUrl, {
        params: {
          access_key: this.apiKey,
          email: email,
          smtp: 1,
          format: 1
        }
      });

      const data = response.data;
      
      // Analyse détaillée de la réponse
      console.log('📊 Réponse Mailboxlayer:', {
        format_valid: data.format_valid,
        mx_found: data.mx_found,
        smtp_check: data.smtp_check,
        score: data.score
      });

      const isValid = data.format_valid && data.smtp_check;
      
      if (!isValid) {
        let reason = "Email invalide";
        if (!data.format_valid) reason = "Format d'email invalide";
        else if (!data.mx_found) reason = "Le domaine n'existe pas";
        else if (!data.smtp_check) reason = "L'adresse email n'existe pas sur ce domaine";
        else if (data.disposable) reason = "Les emails jetables ne sont pas autorisés";
        
        return {
          success: true,
          isValid: false,
          reason: reason,
          details: data
        };
      }

      return {
        success: true,
        isValid: true,
        score: data.score || 0,
        details: data
      };
    } catch (error) {
      console.error('❌ Erreur vérification email:', error.message);
      
      // En cas d'erreur API, on accepte l'email par sécurité
      console.log('⚠️ Erreur API, email accepté par défaut');
      return {
        success: false,
        isValid: true,
        mock: true,
        error: error.message
      };
    }
  }

  /**
   * Vérification simple du format
   */
  isFormatValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

module.exports = new EmailVerificationService();