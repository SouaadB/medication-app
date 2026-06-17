const db = require('../config/database');
const FirebaseService = require('../services/firebaseService');

// ── Send a message ─────────────────────────────────────────────────────────
exports.sendMessage = async (req, res) => {
    try {
        const senderId   = req.user.id;
        const senderRole = req.user.role; // 'patient' or 'caregiver'
        let { receiver_id, message } = req.body;

        if (!receiver_id || !message?.trim()) {
            return res.status(400).json({ success: false, message: 'receiver_id and message are required' });
        }

        // Verify the relationship exists and get receiver FCM token
        let fcmToken = null;
        let senderName = req.user.name;

        if (senderRole === 'caregiver') {
            // caregiver → patient: identify caregiver by email, receiver_id = patients.id
            const [rel] = await db.execute(
                `SELECT p.fcm_token
                 FROM caregivers cg
                 JOIN patients p ON cg.patient_id = p.id
                 WHERE cg.email = ? AND cg.patient_id = ? AND cg.status = 'ACTIVE'`,
                [req.user.email, receiver_id]
            );
            if (rel.length === 0)
                return res.status(403).json({ success: false, message: 'No active relationship found' });
            fcmToken = rel[0].fcm_token;

        } else {
            // patient → caregiver: receiver_id = caregivers.id from patient's list
            // look up caregiver_users.id so messages are stored with the correct caregiver ID
            const [rel] = await db.execute(
                `SELECT cu.id AS caregiver_user_id, cu.fcm_token
                 FROM caregivers cg
                 JOIN caregiver_users cu ON cg.email = cu.email
                 WHERE cg.patient_id = ? AND cg.id = ? AND cg.status = 'ACTIVE'`,
                [senderId, receiver_id]
            );
            if (rel.length === 0)
                return res.status(403).json({ success: false, message: 'No active relationship found' });
            fcmToken = rel[0].fcm_token;
            // Override so stored receiver_id = caregiver_users.id (matches caregiver JWT)
            receiver_id = rel[0].caregiver_user_id;
        }

        const receiverRole = senderRole === 'caregiver' ? 'patient' : 'caregiver';

        // Insert message
        const [result] = await db.execute(
            `INSERT INTO chat_messages
             (sender_id, sender_role, receiver_id, receiver_role, message)
             VALUES (?, ?, ?, ?, ?)`,
            [senderId, senderRole, receiver_id, receiverRole, message.trim()]
        );

        // Send push notification
        if (fcmToken) {
            try {
                await FirebaseService.sendPushNotification(
                    fcmToken,
                    `💬 ${senderName}`,
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

// ── Get conversation messages ──────────────────────────────────────────────
exports.getMessages = async (req, res) => {
    try {
        const userId     = req.user.id;
        const userRole   = req.user.role;
        const partnerId  = req.params.partner_id;
        const limit     = parseInt(req.query.limit) || 50;
        const before    = req.query.before ? parseInt(req.query.before) : null;
        const userIdInt    = parseInt(userId);

        // Patient sends partner_id = caregivers.id (relationship record).
        // Messages are stored using caregiver_users.id, so translate before querying.
        let partnerIdInt = parseInt(partnerId);
        if (userRole === 'patient') {
            const [mapping] = await db.execute(
                `SELECT cu.id FROM caregivers cg
                 JOIN caregiver_users cu ON cg.email = cu.email
                 WHERE cg.id = ? AND cg.patient_id = ?`,
                [partnerIdInt, userIdInt]
            );
            if (mapping.length > 0) partnerIdInt = mapping[0].id;
        }

        const query = `
            SELECT
                id, sender_id, sender_role,
                receiver_id, receiver_role,
                message, is_read,
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

        return res.json({
            success:  true,
            messages: rows.reverse(), // oldest first
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
                    THEN (CASE m.receiver_role
                        WHEN 'caregiver' THEN (SELECT name FROM caregiver_users WHERE id = m.receiver_id)
                        WHEN 'patient'   THEN (SELECT name FROM users WHERE id = m.receiver_id)
                    END)
                    ELSE (CASE m.sender_role
                        WHEN 'caregiver' THEN (SELECT name FROM caregiver_users WHERE id = m.sender_id)
                        WHEN 'patient'   THEN (SELECT name FROM users WHERE id = m.sender_id)
                    END)
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

        return res.json({ success: true, conversations: rows });

    } catch (error) {
        console.error('[chatController] getConversations error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch conversations' });
    }
};