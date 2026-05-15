const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Check if service account file exists
const serviceAccountPath = path.join(__dirname, '../../firebase-service-account.json');

class FirebaseService {
    static initialized = false;
    
    static initialize() {
        if (this.initialized) return;
        
        try {
            if (fs.existsSync(serviceAccountPath)) {
                const serviceAccount = require(serviceAccountPath);
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount)
                });
                this.initialized = true;
                console.log('✅ Firebase Admin initialized');
            } else {
                console.log('⚠️ Firebase service account not found. Push notifications disabled.');
                console.log(`   Place firebase-service-account.json at: ${serviceAccountPath}`);
            }
        } catch (error) {
            console.error('❌ Firebase initialization error:', error.message);
        }
    }
    
    // Send push notification to a single device
    static async sendPushNotification(fcmToken, title, body, data = {}) {
        this.initialize();
        
        if (!this.initialized) {
            console.log('⚠️ Firebase not initialized, skipping push notification');
            return false;
        }
        
        if (!fcmToken) {
            console.log('No FCM token available');
            return false;
        }

        try {
            const message = {
                notification: {
                    title: title,
                    body: body,
                },
                data: data,
                token: fcmToken,
                android: {
                    priority: 'high',
                    notification: {
                        channelId: 'medication_reminders',
                        sound: 'default',
                        priority: 'high',
                        clickAction: 'FLUTTER_NOTIFICATION_CLICK',
                    },
                },
                apns: {
                    payload: {
                        aps: {
                            sound: 'default',
                            badge: 1,
                            contentAvailable: true,
                        },
                    },
                },
            };

            const response = await admin.messaging().send(message);
            console.log('✅ Push notification sent:', response);
            return true;
        } catch (error) {
            console.error('❌ Error sending push notification:', error.message);
            return false;
        }
    }

    // Send to multiple devices
    static async sendMulticastNotification(fcmTokens, title, body, data = {}) {
        this.initialize();
        
        if (!this.initialized || !fcmTokens || fcmTokens.length === 0) {
            return false;
        }

        try {
            const message = {
                notification: { title, body },
                data: data,
                tokens: fcmTokens.filter(t => t), // Remove null tokens
            };

            const response = await admin.messaging().sendEachForMulticast(message);
            console.log(`✅ Push sent to ${response.successCount} devices`);
            return response;
        } catch (error) {
            console.error('❌ Error sending multicast:', error.message);
            return false;
        }
    }
}

module.exports = FirebaseService;