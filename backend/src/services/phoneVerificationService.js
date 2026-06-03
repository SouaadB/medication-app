const axios = require('axios');

class PhoneVerificationService {
  constructor() {
    this.apiKey = process.env.NUMVERIFY_API_KEY;
    this.baseUrl = 'http://apilayer.net/api/validate';
    this.isDevMode = process.env.DEV_MODE === 'true';
    
    // Liste des préfixes valides pour l'Algérie
    this.algerianPrefixes = [
      '05', '06', '07'  // Opérateurs algériens
    ];
    
    // Longueur exacte d'un numéro algérien (sans indicatif)
    this.algerianLength = 10;
  }

  /**
   * Vérifie si le numéro est au format algérien
   */
  isAlgerianFormat(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Vérifier la longueur (10 chiffres)
    if (cleanPhone.length !== this.algerianLength) {
      return {
        isValid: false,
        reason: 'Le numéro doit contenir exactement 10 chiffres'
      };
    }
    
    // Vérifier le préfixe
    const prefix = cleanPhone.substring(0, 2);
    if (!this.algerianPrefixes.includes(prefix)) {
      return {
        isValid: false,
        reason: 'Le numéro doit commencer par 05, 06 ou 07 (opérateurs algériens)'
      };
    }
    
    return {
      isValid: true,
      cleanPhone: cleanPhone,
      prefix: prefix
    };
  }

  /**
   * Vérifie si le numéro existe via NumVerify
   */
  async checkWithNumVerify(phone) {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          access_key: this.apiKey,
          number: phone,
          country_code: 'DZ',
          format: 1
        },
        timeout: 5000 // 5 secondes max
      });

      const data = response.data;
      
      return {
        success: true,
        isValid: data.valid === true,
        lineType: data.line_type || 'unknown',
        carrier: data.carrier || 'unknown',
        location: data.location || 'Algeria',
        raw: data
      };
    } catch (error) {
      console.error('❌ Erreur appel NumVerify:', error.message);
      return {
        success: false,
        isValid: false,
        error: error.message
      };
    }
  }

  /**
   * Vérification complète d'un numéro algérien
   */
  async verifyPhone(phone) {
    // ÉTAPE 1: Nettoyer le numéro
    const cleanPhone = phone.replace(/\D/g, '');
    
    // ÉTAPE 2: Vérifier le format algérien
    const formatCheck = this.isAlgerianFormat(phone);
    if (!formatCheck.isValid) {
      return {
        success: false,
        isValid: false,
        message: formatCheck.reason
      };
    }

    // ÉTAPE 3: Vérifier avec NumVerify (si clé API disponible)
    if (this.apiKey && this.apiKey !== 'votre_clé_ici' && !this.isDevMode) {
      try {
        const numVerifyCheck = await this.checkWithNumVerify(cleanPhone);
        
        if (numVerifyCheck.success) {
          if (!numVerifyCheck.isValid) {
            return {
              success: true,
              isValid: false,
              message: 'Ce numéro de téléphone n\'existe pas dans notre base de données'
            };
          }
          
          // Succès - numéro valide
          return {
            success: true,
            isValid: true,
            lineType: numVerifyCheck.lineType,
            carrier: numVerifyCheck.carrier,
            location: numVerifyCheck.location
          };
        }
      } catch (error) {
        console.error('⚠️ Erreur NumVerify, fallback vers validation basique');
      }
    }

    // ÉTAPE 4: Validation basique (si NumVerify échoue)
    // En production, on peut faire une validation plus poussée
    // mais pour l'instant, on accepte les numéros au format correct
    
    // Liste des préfixes d'opérateurs algériens connus
    const operatorPrefixes = {
      '05': ['050', '051', '052', '053', '054', '055', '056', '057', '058', '059'], // Mobilis
      '06': ['060', '061', '062', '063', '064', '065', '066', '067', '068', '069'], // Djezzy
      '07': ['070', '071', '072', '073', '074', '075', '076', '077', '078', '079']  // Ooredoo
    };
    
    const prefix3 = cleanPhone.substring(0, 3);
    const mainPrefix = cleanPhone.substring(0, 2);
    
    // Vérifier si le préfixe à 3 chiffres est valide
    if (operatorPrefixes[mainPrefix] && operatorPrefixes[mainPrefix].includes(prefix3)) {
      return {
        success: true,
        isValid: true,
        message: 'Numéro algérien valide (vérification basique)',
        mock: true
      };
    }

    // Par défaut, on accepte le numéro si le format est bon
    return {
      success: true,
      isValid: true,
      message: 'Numéro au format algérien accepté',
      mock: true
    };
  }

  /**
   * Vérification rapide du format (pour le frontend)
   */
  isFormatValid(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    const prefix = cleanPhone.substring(0, 2);
    
    return cleanPhone.length === 10 && 
           this.algerianPrefixes.includes(prefix);
  }
}

module.exports = new PhoneVerificationService();