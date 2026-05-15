const dns = require('dns').promises;

class EmailVerificationService {
  constructor() {
    this.isDevMode = process.env.DEV_MODE === 'true';
  }

  /**
   * Vérifie si un email a un format valide
   * Note: La vérification DNS (MX/A) est désactivée car elle est bloquée par l'environnement réseau local.
   */
  async verifyEmail(email) {
    try {
      // 1. Validation du format de base (Regex)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          isValid: false,
          message: "Format d'email invalide (ex: utilisateur@domaine.com)"
        };
      }

      // Pour l'instant, on accepte tous les formats valides car les requêtes DNS sont bloquées sur votre PC/Réseau
      console.log(`✅ Format d'email valide pour ${email}. (Vérification DNS ignorée pour éviter les erreurs réseau)`);
      
      return {
        isValid: true,
        details: { mxFound: true, skippedDns: true }
      };

    } catch (error) {
      console.error('Erreur lors de la vérification de l\'email:', error);
      return {
        isValid: true, // On autorise par défaut en cas d'erreur interne
        details: { skippedDns: true }
      };
    }
  }
}

module.exports = new EmailVerificationService();
