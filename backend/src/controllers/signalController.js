const {
  analyzeAndSave,
  getLatestForecast,
  getForecastHistory,
  getLatestForecastForCaregiver,
} = require('../services/adherenceSignalService');

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL CONTROLLER
// Handles all API requests for the Early Warning System
// Feature by: Berrached Malak
// ─────────────────────────────────────────────────────────────────────────────


// ── GET /api/signals/patient/:patientId ──────────────────────────────────────
// Returns latest forecast for a patient.
// If no forecast exists or last one is older than 6 hours → regenerates first.
// Called by: Flutter patient health overview card (Day 6)
// ─────────────────────────────────────────────────────────────────────────────
async function getPatientSignals(req, res) {
  try {
    const patientId = parseInt(req.params.patientId);

    if (!patientId || isNaN(patientId)) {
      return res.status(400).json({ success: false, message: 'Invalid patient ID' });
    }

    // Check if we have a recent forecast (within last 6 hours)
    const existing = await getLatestForecast(patientId);
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);

    let forecast;
    if (!existing || new Date(existing.createdAt) < sixHoursAgo) {
      // Stale or missing — regenerate
      forecast = await analyzeAndSave(patientId);
    } else {
      forecast = existing;
    }

    return res.json({
      success: true,
      data:    forecast,
    });

  } catch (err) {
    console.error('getPatientSignals error:', err);
    return res.status(500).json({ success: false, message: 'Failed to get signals' });
  }
}


// ── POST /api/signals/generate/:patientId ────────────────────────────────────
// Force-generates a fresh forecast regardless of age.
// Called by: cron job (Day 5), manual trigger for testing
// ─────────────────────────────────────────────────────────────────────────────
async function generateSignals(req, res) {
  try {
    const patientId = parseInt(req.params.patientId);

    if (!patientId || isNaN(patientId)) {
      return res.status(400).json({ success: false, message: 'Invalid patient ID' });
    }

    const result = await analyzeAndSave(patientId);

    return res.json({
      success: true,
      message: `Forecast generated for patient ${patientId}`,
      data:    result,
    });

  } catch (err) {
    console.error('generateSignals error:', err);
    return res.status(500).json({ success: false, message: 'Failed to generate signals' });
  }
}


// ── GET /api/signals/patient/:patientId/history ──────────────────────────────
// Returns the last 10 forecasts for a patient (for the trend timeline).
// Called by: Flutter health overview history section (Day 6)
// ─────────────────────────────────────────────────────────────────────────────
async function getPatientHistory(req, res) {
  try {
    const patientId = parseInt(req.params.patientId);
    const limit     = parseInt(req.query.limit) || 10;

    if (!patientId || isNaN(patientId)) {
      return res.status(400).json({ success: false, message: 'Invalid patient ID' });
    }

    const history = await getForecastHistory(patientId, limit);

    return res.json({
      success: true,
      data:    history,
    });

  } catch (err) {
    console.error('getPatientHistory error:', err);
    return res.status(500).json({ success: false, message: 'Failed to get history' });
  }
}


// ── GET /api/signals/caregiver/:email ────────────────────────────────────────
// Returns latest forecasts for all patients under a caregiver.
// Only returns patients with moderate/high/critical risk.
// Called by: Flutter caregiver early warning panel (Day 7)
// ─────────────────────────────────────────────────────────────────────────────
async function getCaregiverSignals(req, res) {
  try {
    const caregiverEmail = req.params.email;

    if (!caregiverEmail) {
      return res.status(400).json({ success: false, message: 'Caregiver email required' });
    }

    const forecasts = await getLatestForecastForCaregiver(caregiverEmail);

    return res.json({
      success: true,
      count:   forecasts.length,
      data:    forecasts,
    });

  } catch (err) {
    console.error('getCaregiverSignals error:', err);
    return res.status(500).json({ success: false, message: 'Failed to get caregiver signals' });
  }
}


module.exports = {
  getPatientSignals,
  generateSignals,
  getPatientHistory,
  getCaregiverSignals,
};