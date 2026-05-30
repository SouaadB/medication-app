const dns = require('dns').promises;
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

class EmailVerificationService {

  async verifyEmail(email) {
    try {
      // 1. Basic format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { isValid: false, message: "Format d'email invalide (ex: utilisateur@domaine.com)" };
      }

      // 2. Extract domain and TLD
      const domain = email.split('@')[1].toLowerCase();
      const domainParts = domain.split('.');
      const tld = domainParts[domainParts.length - 1];
      const domainName = domainParts[domainParts.length - 2];

      // 3. TLD must be at least 2 letters only
      if (tld.length < 2 || !/^[a-z]+$/.test(tld)) {
        return { isValid: false, message: "L'extension de l'email est invalide (ex: .com, .fr, .net)" };
      }

      // 4. Domain name must be at least 2 characters
      if (!domainName || domainName.length < 2) {
        return { isValid: false, message: "Le nom de domaine est invalide" };
      }

      // 5. Known fake/typo domains
      const fakeDomains = [
        'eail.com', 'gmal.com', 'gmial.com', 'gamil.com',
        'yaho.com', 'yahooo.com', 'hotmal.com', 'outlok.com',
        'test.com', 'example.com', 'fake.com', 'noemail.com',
        'nomail.com', 'temp.com', 'mailinator.com', 'tempmail.com',
        'mil.com', 'emmail.com', 'emmmail.com', 'emal.com',
    'gmaill.com', 'yahooo.com', 'outloook.com', 'hotmaill.com',
    'gmailcom.com', 'yahoomail.com', 'fakemail.com', 'mailnull.com',
    'spamgourmet.com', 'trashmail.com', 'yopmail.com', 'guerrillamail.com'
      ];
      if (fakeDomains.includes(domain)) {
        return { isValid: false, message: `Le domaine "${domain}" n'est pas un domaine email valide` };
      }

      // 6. Try DNS MX check
      try {
        const addresses = await Promise.race([
          dns.resolveMx(domain),
          new Promise((_, reject) => setTimeout(() => reject(new Error('DNS timeout')), 3000))
        ]);
        if (addresses && addresses.length > 0) {
          console.log(`✅ Email vérifié par DNS MX: ${email}`);
          return { isValid: true, details: { mxFound: true, dnsVerified: true } };
        } else {
          return { isValid: false, message: `Le domaine "${domain}" n'accepte pas d'emails` };
        }
      } catch (dnsErr) {
        // DNS blocked on this network — fall back to known TLD check
        console.log(`⚠️ DNS non disponible pour ${domain} — validation par TLD`);
        const validTLDs = [
          'com', 'net', 'org', 'edu', 'gov', 'io', 'co',
          'fr', 'dz', 'uk', 'de', 'es', 'it', 'ma', 'tn',
          'info', 'biz', 'me', 'app', 'dev', 'tech', 'online',
          'sa', 'ae', 'eg', 'ly', 'iq', 'jo', 'lb', 'ps', 'ru', 'cn'
        ];
        if (validTLDs.includes(tld)) {
          console.log(`✅ Email accepté par TLD: ${email} (.${tld})`);
          return { isValid: true, details: { mxFound: false, dnsBlocked: true } };
        }
        return { isValid: false, message: `L'extension ".${tld}" n'est pas reconnue` };
      }

    } catch (error) {
      console.error('Erreur vérification email:', error);
      return { isValid: false, message: "Impossible de vérifier cet email. Veuillez réessayer." };
    }
  }
}

module.exports = new EmailVerificationService();