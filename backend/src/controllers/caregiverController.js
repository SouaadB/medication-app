const Caregiver = require('../models/Caregiver');

exports.getCaregivers = async (req, res) => {
    try {
        const caregivers = await Caregiver.findByPatientId(req.user.id);
        res.json({
            success: true,
            count: caregivers.length,
            caregivers
        });
    } catch (error) {
        console.error('Get Caregivers Error:', error);
        res.status(500).json({ success: false, message: 'Error fetching caregivers' });
    }
};

exports.addCaregiver = async (req, res) => {
    try {
        const { name, relationship, email, view_location, view_medications, receive_alerts } = req.body;
        
        if (!name || !relationship || !email) {
            return res.status(400).json({ success: false, message: 'Please provide name, relationship and email' });
        }

        const caregiverId = await Caregiver.create({
            patient_id: req.user.id,
            name,
            relationship,
            email,
            view_location,
            view_medications,
            receive_alerts
        });

        res.status(201).json({
            success: true,
            message: 'Caregiver invitation sent',
            caregiverId
        });
    } catch (error) {
        console.error('Add Caregiver Error:', error);
        res.status(500).json({ success: false, message: 'Error adding caregiver' });
    }
};

exports.removeCaregiver = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Caregiver.delete(id, req.user.id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Caregiver not found' });
        }

        res.json({
            success: true,
            message: 'Caregiver removed successfully'
        });
    } catch (error) {
        console.error('Remove Caregiver Error:', error);
        res.status(500).json({ success: false, message: 'Error removing caregiver' });
    }
};

exports.updateCaregiverStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['PENDING', 'ACTIVE', 'REVOKED'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const result = await Caregiver.updateStatus(id, req.user.id, status);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Caregiver not found' });
        }

        res.json({
            success: true,
            message: 'Caregiver status updated'
        });
    } catch (error) {
        console.error('Update Caregiver Status Error:', error);
        res.status(500).json({ success: false, message: 'Error updating caregiver status' });
    }
};
