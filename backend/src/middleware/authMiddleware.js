const jwt = require('jsonwebtoken');
const User = require('../models/User');
const db = require('../config/database');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Not authorized - No token provided' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        let user;

        if (decoded.role === 'caregiver') {
            // Caregiver tokens must only look up caregiver_users to avoid ID collisions with users table
            const [caregivers] = await db.execute(
                'SELECT id, name, email, \'caregiver\' as role FROM caregiver_users WHERE id = ?',
                [decoded.id]
            );
            if (caregivers.length > 0) user = caregivers[0];
        } else {
            user = await User.findById(decoded.id);
        }
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Not authorized - User not found' 
            });
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(401).json({ 
            success: false, 
            message: 'Not authorized - Invalid token' 
        });
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Not authorized - No user found' 
            });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `User role "${req.user.role}" is not authorized to access this route. Required roles: ${roles.join(', ')}` 
            });
        }
        next();
    };
};