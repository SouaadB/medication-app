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

            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Email de bienvenue envoyé à ${userEmail}`);
            return { success: true };
        } catch (error) {
            console.error('❌ Erreur envoi email bienvenue:', error);
            return { success: false, error: error.message };
        }
    }

    async sendCaregiverInvitation(email, caregiverName, tempPassword) {
        try {
            const acceptLink = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/#/accept-invitation?email=${encodeURIComponent(email)}`;
            
            const mailOptions = {
                from: `"MediCare" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: '📋 You have been invited as a Caregiver on MediCare',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #22C55E; border-radius: 10px;">
                        <div style="text-align: center;">
                            <h1 style="color: #22C55E;">Caregiver Invitation</h1>
                            <div style="font-size: 48px; margin: 20px 0;">👨‍⚕️</div>
                            <h2 style="color: #333;">Hello ${caregiverName},</h2>
                            <p style="font-size: 16px; color: #666; line-height: 1.6;">
                                You have been invited to become a caregiver on <strong>MediCare</strong>.
                                As a caregiver, you will be able to monitor medication adherence and health progress.
                            </p>
                            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #22C55E;">
                                <p style="margin: 10px 0; font-size: 15px;"><strong>Your temporary login credentials:</strong></p>
                                <p style="margin: 5px 0;">📧 Email: <strong>${email}</strong></p>
                                <p style="margin: 5px 0;">🔑 Temporary Password: <strong style="background: #e8e8e8; padding: 4px 8px; border-radius: 4px;">${tempPassword}</strong></p>
                            </div>
                            <p style="font-size: 14px; color: #ff0000; margin-top: 10px;">
                                ⚠️ Please change your password after your first login for security.
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${acceptLink}" 
                                   style="display: inline-block; background-color: #22C55E; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold;">
                                    Accept Invitation →
                                </a>
                            </div>
                            <p style="font-size: 12px; color: #999; margin-top: 30px;">
                                If the button doesn't work, copy and paste this link into your browser:<br>
                                <a href="${acceptLink}" style="color: #22C55E;">${acceptLink}</a>
                            </p>
                            <p style="font-size: 12px; color: #999;">
                                This invitation will expire in 7 days.<br>
                                If you did not expect this invitation, please ignore this email.
                            </p>
                        </div>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Caregiver invitation sent to ${email}`);
            console.log(`🔗 Accept link: ${acceptLink}`);
            return true;
        } catch (error) {
            console.error('❌ Error sending caregiver invitation:', error);
            return false;
        }
    }
}

module.exports = new EmailSenderService();