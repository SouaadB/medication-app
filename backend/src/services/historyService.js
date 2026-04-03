const db = require('../config/database');

class HistoryService {
    // Récupérer l'historique groupé par date
    static async getGroupedHistory(patientId, days = 30) {
        try {
            const query = `
                SELECT 
                    DATE_FORMAT(ms.scheduled_date_time, '%Y-%m-%d') as date,
                    ms.id,
                    DATE_FORMAT(ms.scheduled_date_time, '%H:%i') as time,
                    DATE_FORMAT(ms.scheduled_date_time, '%Y-%m-%d %H:%i:%s') as full_datetime,
                    ms.status,
                    ms.taken_time,
                    t.medication_name,
                    t.dosage,
                    c.name as condition_name
                FROM medication_schedules ms
                JOIN treatments t ON ms.treatment_id = t.id
                LEFT JOIN chronic_conditions c ON t.condition_id = c.id
                WHERE ms.patient_id = ? 
                AND DATE(ms.scheduled_date_time) <= CURDATE()
                AND DATE(ms.scheduled_date_time) >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
                ORDER BY date DESC, ms.scheduled_date_time ASC
            `;
            
            const [rows] = await db.execute(query, [patientId, days]);
            
            // Grouper manuellement par date
            const groupedByDate = {};
            
            for (const row of rows) {
                const date = row.date;
                if (!groupedByDate[date]) {
                    groupedByDate[date] = {
                        date: date,
                        medications: []
                    };
                }
                
                groupedByDate[date].medications.push({
                    id: row.id,
                    time: row.time,
                    full_datetime: row.full_datetime,
                    medication_name: row.medication_name,
                    dosage: row.dosage,
                    condition_name: row.condition_name,
                    status: row.status,
                    taken_time: row.taken_time
                });
            }
            
            // Convertir en tableau
            const history = Object.values(groupedByDate).sort((a, b) => 
                new Date(b.date) - new Date(a.date)
            );
            
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
                    DATE_FORMAT(ms.scheduled_date_time, '%H:%i') as time,
                    DATE_FORMAT(ms.scheduled_date_time, '%Y-%m-%d %H:%i:%s') as full_datetime,
                    ms.status,
                    ms.taken_time,
                    TIME_FORMAT(ms.taken_time, '%H:%i') as taken_time_formatted,
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
                AND DATE(scheduled_date_time) <= CURDATE()
                AND DATE(scheduled_date_time) >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
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
                AND DATE(ms.scheduled_date_time) <= CURDATE()
                AND DATE(ms.scheduled_date_time) >= DATE_SUB(CURDATE(), INTERVAL ? WEEK)
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