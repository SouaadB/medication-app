const db = require('../config/database');

class HistoryService {
    // Récupérer l'historique groupé par date
    static async getGroupedHistory(patientId, days = 30) {
        try {
            const query = `
                SELECT 
                    DATE(ms.scheduled_date_time) as date,
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', ms.id,
                            'time', DATE_FORMAT(ms.scheduled_date_time, '%h:%i %p'),
                            'full_datetime', ms.scheduled_date_time,
                            'medication_name', t.medication_name,
                            'dosage', t.dosage,
                            'condition_name', c.name,
                            'status', ms.status,
                            'taken_time', ms.taken_time
                        )
                    ) as medications
                FROM medication_schedules ms
                JOIN treatments t ON ms.treatment_id = t.id
                LEFT JOIN chronic_conditions c ON t.condition_id = c.id
                WHERE ms.patient_id = ? 
                AND ms.scheduled_date_time >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
                GROUP BY DATE(ms.scheduled_date_time)
                ORDER BY date DESC
            `;
            
            const [rows] = await db.execute(query, [patientId, days]);
            
            // CORRECTION: Vérifier si medications est déjà un objet ou une chaîne
            const history = rows.map(row => {
                let medications = row.medications;
                // Si c'est une chaîne JSON, la parser
                if (typeof medications === 'string') {
                    try {
                        medications = JSON.parse(medications);
                    } catch (e) {
                        medications = [];
                    }
                }
                return {
                    date: row.date,
                    medications: medications || []
                };
            });
            
            return history;
        } catch (error) {
            console.error('Error in getGroupedHistory:', error);
            throw error;
        }
    }

    // Récupérer l'historique pour une date spécifique
    static async getHistoryByDate(patientId, date) {
        try {
            const query = `
                SELECT 
                    ms.id,
                    DATE_FORMAT(ms.scheduled_date_time, '%h:%i %p') as time,
                    ms.scheduled_date_time as full_datetime,
                    ms.status,
                    ms.taken_time,
                    TIME_FORMAT(ms.taken_time, '%h:%i %p') as taken_time_formatted,
                    t.medication_name,
                    t.dosage,
                    c.name as condition_name
                FROM medication_schedules ms
                JOIN treatments t ON ms.treatment_id = t.id
                LEFT JOIN chronic_conditions c ON t.condition_id = c.id
                WHERE ms.patient_id = ? 
                AND DATE(ms.scheduled_date_time) = DATE(?)
                ORDER BY ms.scheduled_date_time ASC
            `;
            
            const [rows] = await db.execute(query, [patientId, date]);
            
            const total = rows.length;
            const taken = rows.filter(r => r.status === 'TAKEN').length;
            const missed = rows.filter(r => r.status === 'MISSED').length;
            const scheduled = rows.filter(r => r.status === 'SCHEDULED').length;
            
            return {
                date,
                total,
                taken,
                missed,
                scheduled,
                medications: rows
            };
        } catch (error) {
            console.error('Error in getHistoryByDate:', error);
            throw error;
        }
    }

    // Récupérer les statistiques d'observance
    static async getAdherenceStats(patientId, days = 30) {
        try {
            const query = `
                SELECT 
                    COUNT(*) as total_doses,
                    SUM(CASE WHEN status = 'TAKEN' THEN 1 ELSE 0 END) as taken_doses,
                    SUM(CASE WHEN status = 'MISSED' THEN 1 ELSE 0 END) as missed_doses,
                    SUM(CASE WHEN status = 'SCHEDULED' AND scheduled_date_time < NOW() THEN 1 ELSE 0 END) as overdue_doses,
                    ROUND((SUM(CASE WHEN status = 'TAKEN' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0)) * 100, 1) as adherence_rate
                FROM medication_schedules
                WHERE patient_id = ?
                AND scheduled_date_time >= DATE_SUB(NOW(), INTERVAL ? DAY)
            `;
            
            const [rows] = await db.execute(query, [patientId, days]);
            return rows[0] || {
                total_doses: 0,
                taken_doses: 0,
                missed_doses: 0,
                overdue_doses: 0,
                adherence_rate: 0
            };
        } catch (error) {
            console.error('Error in getAdherenceStats:', error);
            throw error;
        }
    }

    // Récupérer les tendances par jour de la semaine
    static async getWeeklyTrends(patientId, weeks = 4) {
        try {
            const query = `
                SELECT 
                    DAYOFWEEK(ms.scheduled_date_time) as day_of_week,
                    DAYNAME(ms.scheduled_date_time) as day_name,
                    COUNT(*) as total_doses,
                    SUM(CASE WHEN ms.status = 'TAKEN' THEN 1 ELSE 0 END) as taken_doses,
                    ROUND((SUM(CASE WHEN ms.status = 'TAKEN' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0)) * 100, 1) as adherence_rate
                FROM medication_schedules ms
                WHERE ms.patient_id = ?
                AND ms.scheduled_date_time >= DATE_SUB(NOW(), INTERVAL ? WEEK)
                GROUP BY DAYOFWEEK(ms.scheduled_date_time), DAYNAME(ms.scheduled_date_time)
                ORDER BY DAYOFWEEK(ms.scheduled_date_time)
            `;
            
            const [rows] = await db.execute(query, [patientId, weeks]);
            return rows;
        } catch (error) {
            console.error('Error in getWeeklyTrends:', error);
            throw error;
        }
    }

    // Récupérer les médicaments les plus manqués
    static async getMostMissedMedications(patientId, limit = 5) {
        try {
            const query = `
                SELECT 
                    t.medication_name,
                    t.dosage,
                    c.name as condition_name,
                    COUNT(*) as missed_count
                FROM medication_schedules ms
                JOIN treatments t ON ms.treatment_id = t.id
                LEFT JOIN chronic_conditions c ON t.condition_id = c.id
                WHERE ms.patient_id = ? 
                AND ms.status = 'MISSED'
                GROUP BY t.id, t.medication_name, t.dosage, c.name
                ORDER BY missed_count DESC
                LIMIT ?
            `;
            
            const [rows] = await db.execute(query, [patientId, limit]);
            return rows;
        } catch (error) {
            console.error('Error in getMostMissedMedications:', error);
            throw error;
        }
    }
}

module.exports = HistoryService;