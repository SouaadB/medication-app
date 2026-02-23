const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    getProfile, 
    updateProfile, 
    changePassword 
} = require('../controllers/profileController');

// Toutes les routes sont protégées
router.use(protect);

// Récupérer le profil
router.get('/', getProfile);

// Mettre à jour le profil
router.put('/', updateProfile);

// Changer le mot de passe
router.put('/password', changePassword);

module.exports = router;