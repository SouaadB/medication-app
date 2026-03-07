const nodemailer = require('nodemailer');

class EmailSenderService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async sendWelcomeEmail(userEmail, userName) {
        try {
            const mailOptions = {
                from: `"MediCare" <${process.env.EMAIL_USER}>`,
                to: userEmail,
                subject: '🎉 Bienvenue sur MediCare !',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #007AFF; border-radius: 10px;">
                        <div style="text-align: center;">
                            <h1 style="color: #007AFF;">Bienvenue sur MediCare !</h1>
                            <div style="font-size: 48px; margin: 20px 0;">💊</div>
                            <h2 style="color: #333;">Bonjour ${userName},</h2>
                            <p style="font-size: 16px; color: #666; line-height: 1.6;">
                                Nous sommes ravis de vous accueillir dans la communauté MediCare. 
                                Votre application de suivi de médicaments personnalisée.
                            </p>
                            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <p style="margin: 10px 0; font-size: 15px;">✨ Ce que vous pouvez faire :</p>
                                <p style="margin: 5px 0;">✓ Gérer vos traitements</p>
                                <p style="margin: 5px 0;">✓ Suivre vos prises</p>
                                <p style="margin: 5px 0;">✓ Recevoir des rappels</p>
                                <p style="margin: 5px 0;">✓ Visualiser votre observance</p>
                            </div>
                            <p style="font-size: 14px; color: #999; margin-top: 30px;">
                                À très bientôt sur MediCare !<br>
                                L'équipe MediCare
                            </p>
                        </div>
                    </div>
                `
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log(`✅ Email de bienvenue envoyé à ${userEmail}`);
            return { success: true };
        } catch (error) {
            console.error('❌ Erreur envoi email bienvenue:', error);
            return { success: false, error: error.message };
        }
    }
}

module.exports = new EmailSenderService();