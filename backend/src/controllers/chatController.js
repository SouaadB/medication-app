const db = require('../config/database');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const FirebaseService = require('../services/firebaseService');

// ── Voice message upload config ──────────────────────────────────────────────
const VOICE_UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads', 'chat_voice');
if (!fs.existsSync(VOICE_UPLOAD_DIR)) fs.mkdirSync(VOICE_UPLOAD_DIR, { recursive: true });

const voiceStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, VOICE_UPLOAD_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || '.m4a';
        cb(null, `${Date.now()}_${crypto.randomBytes(6).toString('hex')}${ext}`);
    },
});

exports.uploadVoiceMiddleware = multer({
    storage: voiceStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB — voice notes are short
    fileFilter: (req, file, cb) => {
        if (/^audio\//.test(file.mimetype) || file.mimetype === 'application/octet-stream') {
            cb(null, true);
        } else {
            cb(new Error('Only audio files are allowed'));
        }
    },
}).single('audio');

function _audioUrl(audioPath) {
    if (!audioPath) return null;
    const base = (process.env.APP_URL || '').replace(/\/$/, '');
    return `${base}${audioPath}`;
}

// Shared relationship/permission check — verifies an ACTIVE caregiver
// assignment exists between the two participants and returns the OTHER
// side's fcm_token so a push notification can be sent.
async function _checkRelationshipAndGetFcmToken(senderId, senderRole, receiverId) {
    if (senderRole === 'caregiver') {
        const [rel] = await db.execute(
            `SELECT p.fcm_token
             FROM caregiver_assignment ca
             JOIN patients p ON ca.patient_id = p.id
             WHERE ca.caregiver_id = ? AND ca.patient_id = ? AND ca.status = 'ACTIVE'`,
            [senderId, receiverId]
        );
        return rel.length > 0 ? rel[0].fcm_token : undefined;
    }
    const [rel] = await db.execute(
        `SELECT c.fcm_token
         FROM caregiver_assignment ca
         JOIN caregivers c ON c.id = ca.caregiver_id
         WHERE ca.patient_id = ? AND ca.caregiver_id = ? AND ca.status = 'ACTIVE'`,
        [senderId, receiverId]
    );
    return rel.length > 0 ? rel[0].fcm_token : undefined;
}

// ── Send a text message ──────────────────────────────────────────────────────
// Caregivers now live in the same id space as patients (caregivers.id ===
// users.id), so sender_id/receiver_id are always plain users.id — no more
// translating between caregivers.id and a separate caregiver_users.id.
exports.sendMessage = async (req, res) => {
    try {
        const senderId   = req.user.id;
        const senderRole = req.user.role; // 'patient' or 'caregiver'
        const { receiver_id, message } = req.body;

        if (!receiver_id || !message?.trim()) {
            return res.status(400).json({ success: false, message: 'receiver_id and message are required' });
        }

        const fcmToken = await _checkRelationshipAndGetFcmToken(senderId, senderRole, receiver_id);
        if (fcmToken === undefined) {
            return res.status(403).json({ success: false, message: 'No active relationship found' });
        }

        const receiverRole = senderRole === 'caregiver' ? 'patient' : 'caregiver';

        const [result] = await db.execute(
            `INSERT INTO chat_messages
             (sender_id, sender_role, receiver_id, receiver_role, message, message_type)
             VALUES (?, ?, ?, ?, ?, 'text')`,
            [senderId, senderRole, receiver_id, receiverRole, message.trim()]
        );

        if (fcmToken) {
            try {
                await FirebaseService.sendPushNotification(
                    fcmToken,
                    `💬 ${req.user.name}`,
                    message.trim().length > 60
                        ? message.trim().substring(0, 60) + '...'
                        : message.trim(),
                    {
                        type:        'chat_message',
                        sender_id:   String(senderId),
                        sender_role: senderRole,
                        message_id:  String(result.insertId),
                    }
                );
            } catch (fcmErr) {
                console.warn('[chatController] FCM failed (non-fatal):', fcmErr.message);
            }
        }

        return res.status(201).json({
            success:    true,
            message_id: result.insertId,
            created_at: new Date().toISOString(),
        });

    } catch (error) {
        console.error('[chatController] sendMessage error:', error);
        res.status(500).json({ success: false, message: 'Failed to send message' });
    }
};

// ── Send a voice message ─────────────────────────────────────────────────────
exports.sendVoiceMessage = async (req, res) => {
    try {
        const senderId    = req.user.id;
        const senderRole  = req.user.role;
        const receiverId  = parseInt(req.body.receiver_id);
        const duration    = req.body.duration ? parseInt(req.body.duration) : null;

        if (!receiverId || !req.file) {
            if (req.file) fs.unlink(req.file.path, () => {});
            return res.status(400).json({ success: false, message: 'receiver_id and an audio file are required' });
        }

        const fcmToken = await _checkRelationshipAndGetFcmToken(senderId, senderRole, receiverId);
        if (fcmToken === undefined) {
            fs.unlink(req.file.path, () => {});
            return res.status(403).json({ success: false, message: 'No active relationship found' });
        }

        const receiverRole = senderRole === 'caregiver' ? 'patient' : 'caregiver';
        const audioPath = `/uploads/chat_voice/${req.file.filename}`;

        const [result] = await db.execute(
            `INSERT INTO chat_messages
             (sender_id, sender_role, receiver_id, receiver_role, message, message_type, audio_path, audio_duration)
             VALUES (?, ?, ?, ?, ?, 'voice', ?, ?)`,
            [senderId, senderRole, receiverId, receiverRole, '🎤 Voice message', audioPath, duration]
        );

        if (fcmToken) {
            try {
                await FirebaseService.sendPushNotification(
                    fcmToken,
                    `🎤 ${req.user.name}`,
                    'Sent you a voice message',
                    {
                        type:        'chat_message',
                        sender_id:   String(senderId),
                        sender_role: senderRole,
                        message_id:  String(result.insertId),
                    }
                );
            } catch (fcmErr) {
                console.warn('[chatController] FCM failed (non-fatal):', fcmErr.message);
            }
        }

        return res.status(201).json({
            success:        true,
            message_id:     result.insertId,
            audio_url:      _audioUrl(audioPath),
            audio_duration: duration,
            created_at:     new Date().toISOString(),
        });

    } catch (error) {
        console.error('[chatController] sendVoiceMessage error:', error);
        if (req.file) fs.unlink(req.file.path, () => {});
        res.status(500).json({ success: false, message: 'Failed to send voice message' });
    }
};

// ── Get conversation messages ──────────────────────────────────────────────
exports.getMessages = async (req, res) => {
    try {
        const userId     = req.user.id;
        const userRole   = req.user.role;
        const partnerId  = req.params.partner_id;
        const limit     = parseInt(req.query.limit) || 50;
        const before    = req.query.before ? parseInt(req.query.before) : null;
        const userIdInt    = parseInt(userId);
        const partnerIdInt = parseInt(partnerId);

        const query = `
            SELECT
                id, sender_id, sender_role,
                receiver_id, receiver_role,
                message, message_type, audio_path, audio_duration, is_read,
                DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%sZ') AS created_at
            FROM chat_messages
            WHERE (
                (sender_id = ?   AND sender_role   = ? AND receiver_id = ?)
                OR
                (receiver_id = ? AND receiver_role = ? AND sender_id   = ?)
            )
            ${before ? 'AND id < ?' : ''}
            ORDER BY created_at DESC
            LIMIT ${limit}
        `;

        const params = before
            ? [userIdInt, userRole, partnerIdInt, userIdInt, userRole, partnerIdInt, before]
            : [userIdInt, userRole, partnerIdInt, userIdInt, userRole, partnerIdInt];

        const [rows] = await db.execute(query, params);

        // Mark messages sent to me as read
      await db.execute(
            `UPDATE chat_messages SET is_read = TRUE
             WHERE receiver_id = ? AND receiver_role = ? AND sender_id = ? AND is_read = FALSE`,
            [userIdInt, userRole, partnerIdInt]
        );

        const messages = rows.reverse().map(m => ({ ...m, audio_url: _audioUrl(m.audio_path) }));

        return res.json({
            success:  true,
            messages,
        });

    } catch (error) {
        console.error('[chatController] getMessages error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch messages' });
    }
};

// ── Get unread count ───────────────────────────────────────────────────────
exports.getUnreadCount = async (req, res) => {
    try {
        const userId   = req.user.id;
        const userRole = req.user.role;

        const [[row]] = await db.execute(
            `SELECT COUNT(*) AS count FROM chat_messages
             WHERE receiver_id = ? AND receiver_role = ? AND is_read = FALSE`,
            [userId, userRole]
        );

        return res.json({ success: true, count: row.count });

    } catch (error) {
        console.error('[chatController] getUnreadCount error:', error);
        res.status(500).json({ success: false, message: 'Failed to get unread count' });
    }
};

// ── Get conversations list ─────────────────────────────────────────────────
exports.getConversations = async (req, res) => {
    try {
        const userId   = req.user.id;
        const userRole = req.user.role;

        // Get latest message per partner + unread count + partner name
        const [rows] = await db.execute(
            `SELECT
                m.id,
                m.sender_id,
                m.sender_role,
                m.receiver_id,
                m.receiver_role,
                m.message,
                m.message_type,
                m.audio_path,
                m.audio_duration,
                m.is_read,
                DATE_FORMAT(m.created_at, '%Y-%m-%dT%H:%i:%sZ') AS created_at,
                CASE
                    WHEN m.sender_id = ? AND m.sender_role = ?
                    THEN m.receiver_id
                    ELSE m.sender_id
                END AS partner_id,
                CASE
                    WHEN m.sender_id = ? AND m.sender_role = ?
                    THEN m.receiver_role
                    ELSE m.sender_role
                END AS partner_role,
                CASE
                    WHEN m.sender_id = ? AND m.sender_role = ?
                    THEN (SELECT name FROM users WHERE id = m.receiver_id)
                    ELSE (SELECT name FROM users WHERE id = m.sender_id)
                END AS partner_name,
                (SELECT COUNT(*) FROM chat_messages
                 WHERE receiver_id = ? AND receiver_role = ?
                 AND sender_id = CASE
                     WHEN m.sender_id = ? AND m.sender_role = ? THEN m.receiver_id
                     ELSE m.sender_id END
                 AND is_read = FALSE) AS unread_count
             FROM chat_messages m
             INNER JOIN (
                SELECT MAX(id) AS max_id
                FROM chat_messages
                WHERE (sender_id = ? AND sender_role = ?)
                   OR (receiver_id = ? AND receiver_role = ?)
                GROUP BY
                    LEAST(sender_id, receiver_id),
                    GREATEST(sender_id, receiver_id)
             ) latest ON m.id = latest.max_id
             ORDER BY m.created_at DESC`,
            [
                userId, userRole, userId, userRole, userId, userRole,
                userId, userRole, userId, userRole,
                userId, userRole, userId, userRole,
            ]
        );

        const conversations = rows.map(r => ({ ...r, audio_url: _audioUrl(r.audio_path) }));

        return res.json({ success: true, conversations });

    } catch (error) {
        console.error('[chatController] getConversations error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch conversations' });
    }
};
