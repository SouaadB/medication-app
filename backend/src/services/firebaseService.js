const admin = require('firebase-admin');
const path  = require('path');
const fs    = require('fs');

const serviceAccountPath = path.join(__dirname, '../../firebase-service-account.json');
// Add right after:
console.log('Firebase path:', serviceAccountPath);
console.log('File exists:', fs.existsSync(serviceAccountPath));

class FirebaseService {
    static initialized = false;

    static initialize() {
        if (this.initialized) return;
        try {
            if (fs.existsSync(serviceAccountPath)) {
                const serviceAccount = require(serviceAccountPath);
                admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
                this.initialized = true;
                console.log('✅ Firebase Admin initialized');
            } else {
                console.log('⚠️ Firebase service account not found. Push notifications disabled.');
            }
        } catch (error) {
            console.error('❌ Firebase initialization error:', error.message);
        }
    }

    /**
     * Send a push notification to a single device
     * @param {string}  fcmToken   - Device FCM token
     * @param {string}  title      - Notification title
     * @param {string}  body       - Notification body
     * @param {object}  data       - Extra key-value string data (all values must be strings)
     * @param {boolean} isCritical - If true, uses high-priority channel (bypasses Do Not Disturb)
     */
    static async sendPushNotification(fcmToken, title, body, data = {}, isCritical = false) {
        this.initialize();

        if (!this.initialized) {
            console.log('⚠️ Firebase not initialized, skipping push notification');
            return false;
        }

        if (!fcmToken) {
            console.log('⚠️ No FCM token — skipping push');
            return false;
        }

        // FCM data values must all be strings
const stringData = { navigate_to: 'notifications' };
for (const [k, v] of Object.entries(data)) {
    stringData[k] = String(v);
}

        try {
            const message = {
                notification: { title, body },
                data: stringData,
                token: fcmToken,

                android: {
                    priority: 'high',
                    notification: {
                        // Critical medications → use a separate high-importance channel
                        // Regular medications → standard medication_reminders channel
                        channelId:   isCritical ? 'critical_alerts' : 'medication_reminders',
                        sound:       'default',
                        priority:    isCritical ? 'max' : 'high',
                        clickAction: 'FLUTTER_NOTIFICATION_CLICK',
                        // Critical: show even when screen is off
                        visibility:  isCritical ? 'public' : 'private',
                    },
                },

                apns: {
                    headers: {
                        // Critical alerts on iOS can bypass silent mode (requires special entitlement)
                        'apns-priority': isCritical ? '10' : '5',
                    },
                    payload: {
                        aps: {
                            sound:            isCritical ? 'critical_alert.wav' : 'default',
                            badge:            1,
                            contentAvailable: true,
                            // iOS critical alert (requires special Apple entitlement)
                            ...(isCritical ? {
                                'critical-alert': {
                                    name:   'critical_alert.wav',
                                    volume: 1.0,
                                }
                            } : {}),
                        },
                    },
                },
            };

            const response = await admin.messaging().send(message);
            console.log(`✅ Push sent [${isCritical ? 'CRITICAL' : 'normal'}]: ${title}`);
            return true;

        } catch (error) {
            // Handle invalid/expired FCM tokens gracefully
            if (error.code === 'messaging/registration-token-not-registered' ||
                error.code === 'messaging/invalid-registration-token') {
                console.warn(`⚠️ Invalid FCM token for device — consider removing it`);
                return false;
            }
            console.error('❌ Error sending push notification:', error.message);
            return false;
        }
    }

    /**
     * Send to multiple devices at once
     */
    static async sendMulticastNotification(fcmTokens, title, body, data = {}, isCritical = false) {
        this.initialize();
        if (!this.initialized || !fcmTokens || fcmTokens.length === 0) return false;

    const stringData = { navigate_to: 'notifications' };
for (const [k, v] of Object.entries(data)) {
    stringData[k] = String(v);
}

        try {
            const message = {
                notification: { title, body },
                data: stringData,
                tokens: fcmTokens.filter(Boolean),
                android: {
                    priority: 'high',
                    notification: {
                        channelId: isCritical ? 'critical_alerts' : 'medication_reminders',
                        sound: 'default',
                        priority: isCritical ? 'max' : 'high',
                        clickAction: 'FLUTTER_NOTIFICATION_CLICK',
                    },
                },
                apns: {
                    payload: {
                        aps: { sound: 'default', badge: 1, contentAvailable: true },
                    },
                },
            };

            const response = await admin.messaging().sendEachForMulticast(message);
            console.log(`✅ Push sent to ${response.successCount}/${fcmTokens.length} devices`);
            return response;
        } catch (error) {
            console.error('❌ Error sending multicast:', error.message);
            return false;
        }
    }
}
FirebaseService.initialize();
module.exports = FirebaseService;