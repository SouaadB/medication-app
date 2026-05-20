const db = require('../config/database');

// Patient updates their location (called from mobile app)
exports.updateLocation = async (req, res) => {
    console.log('📍 Location update request received');
    console.log('📦 Request body:', req.body);
    console.log('👤 User:', req.user?.id, req.user?.role);
    
    // Safely extract and parse values
    const patient_id = req.body?.patient_id;
    const lat = req.body?.lat ? parseFloat(req.body.lat) : null;
    const lng = req.body?.lng ? parseFloat(req.body.lng) : null;
    const accuracy = req.body?.accuracy ? parseFloat(req.body.accuracy) : null;
    const address = req.body?.address || null;
    
    // Validate required fields
    if (!patient_id) {
        console.log('❌ Missing patient_id');
        return res.status(400).json({ error: 'patient_id is required' });
    }
    
    if (lat === null || lng === null) {
        console.log('❌ Missing coordinates');
        return res.status(400).json({ error: 'lat and lng are required' });
    }
    
    try {
        // Verify the patient owns this account
        if (req.user.id !== patient_id && req.user.role !== 'patient') {
            console.log(`❌ Unauthorized: user ${req.user.id} trying to update patient ${patient_id}`);
            return res.status(403).json({ error: 'Unauthorized' });
        }
        
        console.log(`📍 Updating location for patient ${patient_id}: lat=${lat}, lng=${lng}`);
        
        const [result] = await db.execute(
            `UPDATE patients 
             SET location_sharing_enabled = 1,
                 last_latitude = ?,
                 last_longitude = ?,
                 last_location_accuracy = ?,
                 last_location_address = ?,
                 last_location_timestamp = NOW()
             WHERE id = ?`,
            [lat, lng, accuracy, address, patient_id]
        );
        
        if (result.affectedRows === 0) {
            console.log(`⚠️ Patient ${patient_id} not found`);
            return res.status(404).json({ error: 'Patient not found' });
        }
        
        console.log('✅ Location updated successfully');
        res.json({ success: true, message: 'Location updated' });
        
    } catch (error) {
        console.error('Update location error:', error);
        res.status(500).json({ error: 'Failed to update location', details: error.message });
    }
};

// Caregiver gets patient location
exports.getPatientLocation = async (req, res) => {
    const { patient_id } = req.params;
    const caregiverEmail = req.user.email;
    
    console.log(`📍 Getting location for patient ${patient_id} by caregiver ${caregiverEmail}`);
    
    try {
        // Check if caregiver has permission
        const [permission] = await db.execute(
            `SELECT view_location FROM caregivers 
             WHERE patient_id = ? AND email = ? AND status = 'ACTIVE'`,
            [patient_id, caregiverEmail]
        );
        
        if (permission.length === 0 || permission[0].view_location !== 1) {
            console.log(`❌ Caregiver ${caregiverEmail} has no permission to view location for patient ${patient_id}`);
            return res.status(403).json({ error: 'No permission to view location' });
        }
        
        const [location] = await db.execute(
            `SELECT location_sharing_enabled, last_latitude, last_longitude, 
                    last_location_address, last_location_timestamp
             FROM patients WHERE id = ?`,
            [patient_id]
        );
        
        if (location.length === 0) {
            return res.json({ location: null, sharing_enabled: false });
        }
        
        if (!location[0].location_sharing_enabled || !location[0].last_latitude) {
            return res.json({ 
                location: null, 
                sharing_enabled: location[0].location_sharing_enabled === 1 
            });
        }
        
        const lastLocation = location[0];
        
        // Calculate how long ago
        let timeAgo = 'Never';
        if (lastLocation.last_location_timestamp) {
            const minutes = Math.floor((new Date() - new Date(lastLocation.last_location_timestamp)) / 60000);
            if (minutes < 1) timeAgo = 'Just now';
            else if (minutes < 60) timeAgo = `${minutes} min ago`;
            else if (minutes < 1440) timeAgo = `${Math.floor(minutes / 60)} hours ago`;
            else timeAgo = `${Math.floor(minutes / 1440)} days ago`;
        }
        
        res.json({ 
            success: true,
            location: {
                lat: parseFloat(lastLocation.last_latitude),
                lng: parseFloat(lastLocation.last_longitude),
                address: lastLocation.last_location_address,
                timestamp: lastLocation.last_location_timestamp,
                time_ago: timeAgo
            }, 
            sharing_enabled: true
        });
        
    } catch (error) {
        console.error('Get location error:', error);
        res.status(500).json({ error: 'Failed to get location', details: error.message });
    }
};

// Patient toggles location sharing
exports.toggleLocationSharing = async (req, res) => {
    const { patient_id } = req.params;
    const { enabled } = req.body;
    
    try {
        if (req.user.id !== parseInt(patient_id) && req.user.role !== 'patient') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        
        await db.execute(
            `UPDATE patients SET location_sharing_enabled = ? WHERE id = ?`,
            [enabled ? 1 : 0, patient_id]
        );
        
        res.json({ success: true, sharing_enabled: enabled });
    } catch (error) {
        console.error('Toggle location sharing error:', error);
        res.status(500).json({ error: 'Failed to update sharing setting' });
    }
};